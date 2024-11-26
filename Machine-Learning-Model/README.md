# Electricity Consumption Prediction API

This repository provides a Flask-based REST API for predicting electricity consumption based on weather and categorical inputs. The API serves a machine learning model trained using a dataset (`Dataset.csv`).

## Features
- **POST Endpoint**: Accepts input features in JSON format and returns the predicted electricity consumption.
- Preprocessing and prediction handled within the API.

---

## Prerequisites

1. **Python**: Ensure Python 3.7+ is installed on your system.
2. **Libraries**: Install the required Python libraries:
   ```bash
   pip install -r requirements.txt
   ```

---

## Files in This Repository

1. **`app.py`**: The Flask API implementation.
2. **`electricity_consumption_model.pkl`**: The trained machine learning model.
3. **`scaler.pkl`**: The scaler for preprocessing numerical features.
4. **Dataset**: Training data (`Minor_Waala_dataset.csv`) used to create the model.

---

## Setup Instructions

1. Clone the repository or copy the files to your local machine.
2. Ensure the following files are in the same directory:
   - `app.py`
   - `electricity_consumption_model.pkl`
   - `scaler.pkl`
3. Start the Flask application:
   ```bash
   python app.py
   ```

   The server will start and run on `http://127.0.0.1:5000/`.

---

## API Documentation

### Endpoint
**POST** `/predict`

### Input Format
The API expects a JSON object with the following keys:

| Key                | Type   | Description                                   |
|--------------------|--------|-----------------------------------------------|
| `Temperature (°C)` | Float  | Temperature in Celsius                       |
| `Humidity (%)`     | Float  | Humidity percentage                          |
| `Wind Speed (km/h)`| Float  | Wind speed in km/h                           |
| `Rain (mm)`        | Float  | Rainfall in mm                               |
| `Public Holiday`   | String | `Yes` or `No`                                |
| `Seasonal Factor`  | String | One of: `Summer`, `Winter`, `Spring`, `Autumn` |
| `Day of Week`      | String | One of: `Monday`, `Tuesday`, ..., `Sunday`   |

### Sample Request
```bash
curl -X POST http://127.0.0.1:5000/predict \
-H "Content-Type: application/json" \
-d '{
    "Temperature (°C)": 25.0,
    "Humidity (%)": 60.0,
    "Wind Speed (km/h)": 15.0,
    "Rain (mm)": 0.0,
    "Public Holiday": "Yes",
    "Seasonal Factor": "Summer",
    "Day of Week": "Saturday"
}'
```

### Sample Response
```json
{
    "prediction": 2958.64
}
```

### Error Handling
If the input is invalid or some required fields are missing, the API will return an error in the following format:
```json
{
    "error": "Description of the issue"
}
```

---

## How to Use in a Project

1. **Backend Integration**:
   - Use the `/predict` endpoint in your backend to fetch predictions based on the input features.
   - Use libraries like `requests` in Python or similar tools in other languages to make POST requests.

2. **Frontend Integration**:
   - Create a form to collect input features (e.g., temperature, humidity, etc.).
   - Send a POST request to the API endpoint with the form data.
   - Display the predicted electricity consumption in the UI.

3. **Testing**:
   - Use tools like Postman or cURL to test the API responses before integrating it into your project.

---

## Notes

- The API currently supports local deployment. For production, consider deploying on cloud platforms like AWS, Google Cloud, or Azure.
- Ensure the dataset used for training (`Dataset.csv`) covers all possible categorical values to avoid prediction errors.