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
      const response = await axios.get(
        'http://crop-env-1.eba-mpisjzyb.ap-south-1.elasticbeanstalk.com/predict2',
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
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        maxWidth: '500px',
        margin: 'auto ',
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
          placeholder="Enter crop_year"
          onChange={(e) =>
            setCropData({ ...cropData, Crop_year: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="season "
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
          placeholder="Enter production "
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
      {loading ? <p>Loading...</p> : <p>Predicted Yield: {yieldPrediction}</p>}
    </div>
  );
}

export default YieldPrediction;
