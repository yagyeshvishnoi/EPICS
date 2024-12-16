import React, { useState } from 'react';
import axios from 'axios';

function CropRecommendation() {
  const [cropData, setCropData] = useState({});
  const [cropPrediction, setCropPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCropRecommendation = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/crop_recommendation',
        cropData
      );
      setCropPrediction(response.data.recommended_crop);
    } catch (error) {
      console.error('Error fetching crop recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crop Recommendation</h2>
      <form onSubmit={handleCropRecommendation}>
        <input
          type="text"
          placeholder="Enter soil type"
          onChange={(e) =>
            setCropData({ ...cropData, soilType: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Enter temperature"
          onChange={(e) =>
            setCropData({ ...cropData, temperature: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Enter rainfall"
          onChange={(e) =>
            setCropData({ ...cropData, rainfall: e.target.value })
          }
        />
        <button type="submit">Get Crop Recommendation</button>
      </form>
      {loading ? <p>Loading...</p> : <p>Recommended Crop: {cropPrediction}</p>}
    </div>
  );
}

export default CropRecommendation;
