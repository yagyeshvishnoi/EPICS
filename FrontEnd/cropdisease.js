import React, { useState } from 'react';
import axios from 'axios';

function CropDiseaseDetection() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Set the image file to state
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      alert('Please upload an image!');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/detect_disease', // Endpoint for your crop disease detection
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure correct header for file upload
          },
        }
      );
      setResult(response.data.diseasePrediction); // Assuming response contains disease prediction result
    } catch (error) {
      console.error('Error detecting crop disease:', error);
      setResult('Error detecting crop disease.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crop Disease Detection</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange} // Handle image change
        />
        <button type="submit">Detect Disease</button>
      </form>
      {loading && <p>Loading...</p>}
      {result && <p>Result: {result}</p>} {/* Show the prediction result */}
    </div>
  );
}

export default CropDiseaseDetection;
