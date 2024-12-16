import React, { useState } from 'react';
import axios from 'axios';

function YieldPrediction() {
  const [cropData, setCropData] = useState({});
  const [yieldPrediction, setYieldPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleYieldPrediction = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/yield_prediction',
        cropData
      );
      setYieldPrediction(response.data.predicted_yield);
    } catch (error) {
      console.error('Error fetching yield prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Yield Prediction</h2>
      <form onSubmit={handleYieldPrediction}>
        <input
          type="text"
          placeholder="Enter area (in hectares)"
          onChange={(e) => setCropData({ ...cropData, area: e.target.value })}
        />
        <button type="submit">Predict Yield</button>
      </form>
      {loading ? <p>Loading...</p> : <p>Predicted Yield: {yieldPrediction}</p>}
    </div>
  );
}

export default YieldPrediction;
