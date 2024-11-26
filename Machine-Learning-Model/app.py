from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load pre-trained model and preprocessing tools
model = joblib.load("electricity_consumption_model.pkl")
scaler = joblib.load("scaler.pkl")
label_encoder = joblib.load("label_encoder.pkl")

# Get feature names used during training
trained_feature_names = model.feature_names_in_
numerical_features = ["Temperature (°C)", "Humidity (%)", "Wind Speed (km/h)", "Rain (mm)"]

@app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.json

        # Convert JSON input into a DataFrame
        input_data = pd.DataFrame([data])

        # Perform one-hot encoding for categorical features
        input_data = pd.get_dummies(input_data, columns=["Public Holiday", "Seasonal Factor", "Day of Week"], drop_first=False)

        # Ensure all required columns are present
        for col in trained_feature_names:
            if col not in input_data.columns:
                input_data[col] = 0  # Add missing columns with default value 0

        # Remove extra columns not in trained features
        input_data = input_data[trained_feature_names]

        # Scale numerical features
        input_data[numerical_features] = scaler.transform(input_data[numerical_features])

        # Predict using the model
        prediction = model.predict(input_data)

        # Return the prediction as JSON
        return jsonify({"prediction": prediction[0]})

    except Exception as e:
        return jsonify({"error": str(e)})


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
