import React, { useState } from 'react';
import axios from 'axios';

function CropDiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // State to store image preview
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    // Create an image preview URL
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      alert('Please upload an image!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('img', image);

    try {
      const response = await axios.post(
        'http://13.49.76.63:8000/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Process the prediction result to replace underscores with spaces
      const formattedResult = response.data.prediction.replace(/_/g, ' ');
      setResult(formattedResult);
    } catch (error) {
      console.error('Error detecting crop disease:', error);
      setResult('Error detecting crop disease.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        maxWidth: '500px',
        margin: 'auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>Crop Disease Detection</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange} // Handle image change
          style={{ marginBottom: '10px' }}
        />
        <button
          type="submit"
          style={{ padding: '5px 15px', marginTop: '10px' }}
        >
          Detect Disease
        </button>
      </form>

      {preview && (
        <div style={{ marginTop: '20px' }}>
          <h4>Uploaded Image:</h4>
          <img
            src={preview}
            alt="Uploaded preview"
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              marginBottom: '10px',
            }}
          />
        </div>
      )}

      {loading && <p>Loading...</p>}

      {result && (
        <div>
          <h4>Prediction Result:</h4>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{result}</p>
        </div>
      )}
    </div>
  );
}

export default CropDiseaseDetection;
