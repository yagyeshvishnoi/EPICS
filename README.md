# 🌾 Harvest Hub – AI Driven Agricultural Insights

Harvest Hub is a full-stack AI-powered web platform developed to help farmers make smarter and data-driven agricultural decisions. The platform integrates machine learning and computer vision models to provide real-time insights for:

- ✅ Crop Recommendation  
- 📈 Crop Yield Prediction  
- 🍂 Plant Disease Detection  

---

## 🚀 Features

- **Crop Recommendation**  
  Suggests the most suitable crop based on inputs like NPK values, pH, rainfall, temperature, and humidity.  
  → Achieved ~96% accuracy using a Random Forest Classifier.

- **Yield Prediction**  
  Predicts the expected yield of a given crop using Decision Tree Regression.  
  → Achieved ~85% prediction accuracy.

- **Plant Disease Detection**  
  Identifies plant diseases from leaf images using a Transformer-based deep learning model.  
  → Trained on 87,000+ images with ~92% classification accuracy.

---

## 🧱 Tech Stack

- **Frontend**: React.js  
- **Backend**: Flask (Python)  
- **Machine Learning Models**:  
  - Random Forest for crop recommendation  
  - Decision Tree for yield prediction  
  - Vision Transformer for disease detection

- **Computer Vision**: OpenCV  
- **Cloud Deployment**:  
  - AWS Elastic Beanstalk (for Flask APIs)  
  - AWS EC2 (for image-based disease detection)  
  - AWS S3 (for storing static assets and models)

---

## 💡 Motivation

The goal of Harvest Hub is to leverage AI and cloud technologies to empower farmers with tools that are practical, accurate, and accessible—ultimately enhancing agricultural productivity and sustainability.

---

## 📂 Project Structure

```
harvest-hub/
├── frontend/          # React frontend
├── backend/           # Flask APIs and ML models
├── disease-model/     # Vision Transformer for plant disease detection
├── datasets/          # Data for training and testing
├── utils/             # Helper scripts
└── README.md
```


> *This project was developed as part of an academic initiative to explore the application of AI in solving real-world agricultural challenges.*
