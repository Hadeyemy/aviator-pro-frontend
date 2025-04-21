// App.jsx
import React, { useState } from "react";

export default function AviatorPredictionApp() {
  // State to store user input history of crash odds
  const [history, setHistory] = useState("");
  
  // User's total bankroll
  const [bankroll, setBankroll] = useState(100);

  // The current prediction shown to the user
  const [prediction, setPrediction] = useState(null);

  // Keeps track of which round we're on (0–9)
  const [currentRound, setCurrentRound] = useState(0);

  // List of 10 AI-generated predictions
  const [predictionsList, setPredictionsList] = useState([]);

  // Actual user-inputted result of last round
  const [result, setResult] = useState(null);

  // Function to call backend and get prediction list
  const handlePredict = async () => {
    const res = await fetch("https://aviator-pro-back.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, bankroll }),
    });
    const data = await res.json();

    // Set the first prediction to display and store full list
    setPrediction(data.predictions[0]);
    setPredictionsList(data.predictions);
  };

  // Function to submit the result and move to the next round
  const handleNextRound = () => {
    if (!result) return;

    // Append the result to the existing history
    const newHistory = history.trim() + "," + result;
    setHistory(newHistory);

    // Move to the next round
    setCurrentRound(currentRound + 1);
    setResult(null);

    // Show next prediction or end the session
    if (currentRound + 1 < predictionsList.length) {
      setPrediction(predictionsList[currentRound + 1]);
    } else {
      alert("All 10 rounds completed.");
      setPrediction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Aviator Pro Predictor
        </h1>

        {/* Input for past crash data */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">
            Enter Past Crash Data (comma-separated):
          </label>
          <textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            rows="3"
            className="mt-1 p-2 w-full border rounded"
            placeholder="e.g., 1.23, 2.05, 1.01, 3.45"
          ></textarea>
        </div>

        {/* Bankroll input */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Bankroll:</label>
          <input
            type="number"
            value={bankroll}
            onChange={(e) => setBankroll(parseFloat(e.target.value))}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        {/* Button to fetch predictions */}
        <button
          onClick={handlePredict}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          Start Prediction
        </button>

        {/* Display current round prediction */}
        {prediction !== null && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-green-700">
              Prediction for Round {currentRound + 1}:
            </h2>
            <p className="text-2xl font-bold">{prediction}x</p>

            {/* User input for actual round result */}
            <div className="mt-4">
              <label className="block font-medium text-gray-700">
                Enter Actual Result (Crash Odd):
              </label>
              <input
                type="text"
                value={result || ""}
                onChange={(e) => setResult(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
              />

              {/* Submit result and move to next round */}
              <button
                onClick={handleNextRound}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
              >
                Submit Result & Predict Next Round
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
