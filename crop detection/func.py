import os                       # for working with files
import numpy as np              # for numerical computationss

import pandas as pd             # for working with dataframes
import torch                    # Pytorch module 
import matplotlib.pyplot as plt # for plotting informations on graph and images using tensors
import torch.nn as nn           # for creating  neural networks
from torch.utils.data import DataLoader # for dataloaders 
from PIL import Image           # for checking images
import torch.nn.functional as F # for functions for calculating loss
import torchvision.transforms as transforms   # for transforming images into tensors 
from torchvision.utils import make_grid       # for data checking
from torchvision.datasets import ImageFolder  # for working with classes and images
from torchsummary import summary              # for getting the summary of our model
import torch
import torch.nn as nn
import torch.nn.functional as F
import pickle



# For selecting the default device (GPU if available, else CPU)
def get_default_device():
    """Pick GPU if available, else CPU"""
    if torch.cuda.is_available():  # Add parentheses to properly call the function
        return torch.device("cuda")
    else:
        return torch.device("cpu")

# For moving data to the chosen device
def to_device(data, device):
    """Move tensor(s) to the chosen device (CPU or GPU)"""
    if isinstance(data, (list, tuple)):
        return [to_device(x, device) for x in data]
    return data.to(device, non_blocking=True)

# Wrapper for DataLoader to automatically move batches to the chosen device
class DeviceDataLoader:
    """Wrap a dataloader to move data to a device"""
    def __init__(self, dl, device):
        self.dl = dl
        self.device = device
        
    def __iter__(self):
        """Yield a batch of data after moving it to device"""
        for b in self.dl:
            yield to_device(b, self.device)
        
    def __len__(self):
        """Number of batches"""
        return len(self.dl)




# For calculating the accuracy
def accuracy(outputs, labels):
    """
    Calculate accuracy: Compares predictions with actual labels.
    Args:
        outputs: Model predictions (logits or probabilities).
        labels: Actual labels.
    Returns:
        Accuracy as a PyTorch tensor.
    """
    _, preds = torch.max(outputs, dim=1)  # Get predicted class indices
    return torch.tensor(torch.sum(preds == labels).item() / len(preds))  # Compute accuracy


# Base class for image classification models
class ImageClassificationBase(nn.Module):
    def training_step(self, batch):
        """
        Training step: Computes loss for a batch.
        Args:
            batch: A tuple containing images and labels.
        Returns:
            Loss value.
        """
        images, labels = batch
        out = self(images)                  # Generate predictions
        loss = F.cross_entropy(out, labels) # Calculate cross-entropy loss
        return loss
    
    def validation_step(self, batch):
        """
        Validation step: Computes loss and accuracy for a batch.
        Args:
            batch: A tuple containing images and labels.
        Returns:
            A dictionary with validation loss and accuracy.
        """
        images, labels = batch
        out = self(images)                   # Generate predictions
        loss = F.cross_entropy(out, labels)  # Calculate loss
        acc = accuracy(out, labels)          # Calculate accuracy
        return {"val_loss": loss.detach(), "val_accuracy": acc}
    
    def validation_epoch_end(self, outputs):
        """
        Combine outputs of validation steps across an epoch.
        Args:
            outputs: List of dictionaries from validation steps.
        Returns:
            A dictionary with average validation loss and accuracy.
        """
        batch_losses = [x["val_loss"] for x in outputs]
        batch_accuracy = [x["val_accuracy"] for x in outputs]
        epoch_loss = torch.stack(batch_losses).mean()  # Average loss
        epoch_accuracy = torch.stack(batch_accuracy).mean()  # Average accuracy
        return {"val_loss": epoch_loss, "val_accuracy": epoch_accuracy}
    



# Convolution block with BatchNormalization and optional MaxPooling
def ConvBlock(in_channels, out_channels, pool=False):
    """
    Creates a convolutional block with BatchNorm and ReLU activation.
    Args:
        in_channels: Number of input channels.
        out_channels: Number of output channels.
        pool: Whether to apply MaxPooling.
    Returns:
        A sequential block with Conv2D, BatchNorm, ReLU, and optional MaxPooling.
    """
    layers = [
        nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
        nn.BatchNorm2d(out_channels),
        nn.ReLU(inplace=True)
    ]
    if pool:
        layers.append(nn.MaxPool2d(4))  # Pooling with kernel size of 4
    return nn.Sequential(*layers)


# ResNet9 architecture
class ResNet9(ImageClassificationBase):
    def __init__(self, in_channels, num_classes):
        """
        Initializes the ResNet9 model.
        Args:
            in_channels: Number of input channels (e.g., 3 for RGB images).
            num_classes: Number of output classes (e.g., number of diseases).
        """
        super().__init__()
        
        # Initial convolutional layers
        self.conv1 = ConvBlock(in_channels, 64)
        self.conv2 = ConvBlock(64, 128, pool=True)  # Downsample with pooling
        self.res1 = nn.Sequential(
            ConvBlock(128, 128),
            ConvBlock(128, 128)
        )  # First residual block
        
        # Deeper convolutional layers
        self.conv3 = ConvBlock(128, 256, pool=True)
        self.conv4 = ConvBlock(256, 512, pool=True)
        self.res2 = nn.Sequential(
            ConvBlock(512, 512),
            ConvBlock(512, 512)
        )  # Second residual block
        
        # Classifier head
        self.classifier = nn.Sequential(
            nn.MaxPool2d(4),  # Global average pooling
            nn.Flatten(),     # Flatten for linear layer
            nn.Linear(512, num_classes)
        )
        
    def forward(self, xb):
        """
        Forward pass through the network.
        Args:
            xb: Input batch of images.
        Returns:
            Output logits for each class.
        """
        # Initial convolutional layers
        out = self.conv1(xb)
        out = self.conv2(out)
        out = self.res1(out) + out  # Residual connection
        
        # Deeper convolutional layers
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out  # Residual connection
        
        # Classifier head
        out = self.classifier(out)
        return out


def predict_image(img, model):
    """Converts image to array and return the predicted class
        with highest probability"""
    # Convert to a batch of 1
    xb = to_device(img.unsqueeze(0), device)
    # Get predictions from model
    yb = model(xb)
    # Pick index with highest probability
    _, preds  = torch.max(yb, dim=1)
    # Retrieve the class label

    return train_classes[preds[0].item()]


# Load the model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Provided class names from the output
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy', 
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy', 
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot', 
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy', 
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy', 
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 
    'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 
    'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 'Tomato___Early_blight', 
    'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 
    'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

plants = set(name.split('___')[0] for name in class_names)

# Number of unique plants
num_classes = len(plants)

model = ResNet9(3, 38)  # Define the model 


model.load_state_dict(torch.load('model.pth', map_location=device,weights_only=True))  # Load the model weights onto the device (CPU or GPU)
model.to(device)  # Move the model to the appropriate device (GPU or CPU)
model.eval()  # Set the model to evaluation mode




# Load train.classes from the file
with open('train_classes.pkl', 'rb') as f:
    train_classes = pickle.load(f)
