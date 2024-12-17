import React, { useState } from 'react';
import axios from 'axios';

function YieldPrediction() {
  const [cropData, setCropData] = useState({});
  const [yieldPrediction, setYieldPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleYieldPrediction = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create a query string with cropData
      const params = new URLSearchParams(cropData).toString();

      const response = await axios.get(
        `http://crop-env-1.eba-mpisjzyb.ap-south-1.elasticbeanstalk.com/predict2?${params}`
      );

      if (response.data.success) {
        setYieldPrediction(response.data.prediction);
      } else {
        setError(response.data.error || 'Prediction failed.');
      }
    } catch (error) {
      console.error('Error fetching yield prediction:', error);
      setError('An error occurred while fetching the prediction.');
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
      }}
    >
      <h2>Yield Prediction</h2>
      <form
        onSubmit={handleYieldPrediction}
        style={{
          display: 'grid',
          gap: '10px',
          justifyItems: 'center',
          textAlign: 'left',
        }}
      >
        <input
          type="text"
          placeholder="Enter crop"
          onChange={(e) => setCropData({ ...cropData, Crop: e.target.value })}
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter crop_Year"
          onChange={(e) =>
            setCropData({ ...cropData, Crop_Year: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="season"
          onChange={(e) => setCropData({ ...cropData, Season: e.target.value })}
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="state"
          onChange={(e) => setCropData({ ...cropData, State: e.target.value })}
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter area (in hectares)"
          onChange={(e) => setCropData({ ...cropData, Area: e.target.value })}
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter production"
          onChange={(e) =>
            setCropData({ ...cropData, Production: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter annual rainfall"
          onChange={(e) =>
            setCropData({ ...cropData, Annual_Rainfall: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter fertilizer"
          onChange={(e) =>
            setCropData({ ...cropData, Fertilizer: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter pesticide"
          onChange={(e) =>
            setCropData({ ...cropData, Pesticide: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <button type="submit">Predict Yield</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && yieldPrediction && <p>Predicted Yield: {yieldPrediction}</p>}
    </div>
  );
}

export default YieldPrediction;
