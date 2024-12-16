import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CropRecommendation from './components/croprecommendation';
import YieldPrediction from './components/yieldprediction';
import DiseaseDetection from './components/cropdisease';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <div>
                <h1>Crop Recommendation and Analysis System</h1>
                <div className="card-container">
                  <div className="card">
                    <h2>Crop Recommendation</h2>
                    <p>
                      Find the best crop for your soil and climate conditions.
                    </p>
                    <Link to="/crop-recommendation">
                      <button>Go to Crop Recommendation</button>
                    </Link>
                  </div>

                  <div className="card">
                    <h2>Yield Prediction</h2>
                    <p>Predict the potential yield of your crops.</p>
                    <Link to="/yield-prediction">
                      <button>Go to Yield Prediction</button>
                    </Link>
                  </div>

                  <div className="card">
                    <h2>Disease Detection</h2>
                    <p>Detect diseases affecting your crops using images.</p>
                    <Link to="/disease-detection">
                      <button>Go to Disease Detection</button>
                    </Link>
                  </div>
                </div>
              </div>
            }
          />

          {/* Routes for each form */}
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/yield-prediction" element={<YieldPrediction />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
