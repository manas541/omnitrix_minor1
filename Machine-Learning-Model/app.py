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

# Load the dataset
data_file = "Dataset.csv"
df = pd.read_csv(data_file)


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


# @app.route('/dataset', methods=['GET'])
# def get_dataset():
#     """
#     Serve the dataset as JSON.
#     """
#     try:
#         # Convert the dataset to a dictionary format for JSON
#         data = dataset.to_dict(orient="records")
#         return jsonify(data)
#     except Exception as e:
#         return jsonify({"error": str(e)})
    
# Endpoint to fetch filtered data
@app.route('/api/load-data', methods=['GET'])
def get_load_data():
    try:
        # Get the filter type from the query parameters (default to 'year')
        filter_type = request.args.get('filter', 'year').lower()

        if filter_type == 'year':
            # Return the entire dataset for the year
            filtered_data = df[['Date', 'Historical Demand (MW)']].rename(columns={'Date': 'date', 'Historical Demand (MW)': 'load'})
        elif filter_type == 'month':
            # Filter data for the current month (e.g., January)
            month = request.args.get('month', '01')  # Default to January
            filtered_data = df[df['Date'].str.startswith(f'2024-{month}')][['Date', 'Historical Demand (MW)']].rename(columns={'Date': 'date', 'Historical Demand (MW)': 'load'})
        elif filter_type == 'week':
            # Filter data for a specific week (e.g., first 7 days)
            start_date = pd.to_datetime(request.args.get('start_date', '2024-01-01'))  # Default to first week of January
            end_date = start_date + pd.Timedelta(days=6)
            filtered_data = df[(pd.to_datetime(df['Date']) >= start_date) & (pd.to_datetime(df['Date']) <= end_date)][['Date', 'Historical Demand (MW)']].rename(columns={'Date': 'date', 'Historical Demand (MW)': 'load'})
        else:
            return jsonify({"error": "Invalid filter type"}), 400

        # Convert to dictionary
        result = filtered_data.to_dict(orient='records')
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
