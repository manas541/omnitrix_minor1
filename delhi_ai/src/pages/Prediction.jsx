import { useState } from "react";
import { Card, Title, Button, Select, SelectItem } from "@tremor/react";
import axios from "axios";

function Prediction() {
  const [temperature, setTemperature] = useState({ min: "", max: "" });
  const [humidity, setHumidity] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [publicHoliday, setPublicHoliday] = useState(false);
  const [seasonalFactor, setSeasonalFactor] = useState("Summer");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePrediction = async () => {
    // Validate inputs
    if (!temperature.min || !temperature.max || !humidity || !windSpeed) {
      setError("All fields are required.");
      return;
    }

    const inputData = {
      "Temperature (°C)": parseFloat(temperature.max),
      "Humidity (%)": parseFloat(humidity),
      "Wind Speed (km/h)": parseFloat(windSpeed),
      "Rain (mm)": 0.0,
      "Public Holiday": publicHoliday ? "Yes" : "No",
      "Seasonal Factor": seasonalFactor,
      "Day of Week": dayOfWeek,
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", inputData);
      setPredictionResult(response.data.prediction);
      setError(null);
    } catch (err) {
      setError("Failed to fetch prediction. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <Title>Load Prediction Parameters</Title>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Seasonal Factor</label>
              <Select
                className="mt-1 bg-white rounded shadow"
                value={seasonalFactor}
                onValueChange={setSeasonalFactor}
              >
                <SelectItem className="bg-white hover:bg-gray-100" value="Summer">
                  Summer
                </SelectItem>
                <SelectItem className="bg-white hover:bg-gray-100" value="Winter">
                  Winter
                </SelectItem>
                <SelectItem className="bg-white hover:bg-gray-100" value="Spring">
                  Spring
                </SelectItem>
                <SelectItem className="bg-white hover:bg-gray-100" value="Autumn">
                  Autumn
                </SelectItem>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Day of Week</label>
              <Select
                className="mt-1 bg-white rounded shadow"
                value={dayOfWeek}
                onValueChange={setDayOfWeek}
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day) => (
                    <SelectItem
                      className="bg-white hover:bg-gray-100"
                      key={day}
                      value={day}
                    >
                      {day}
                    </SelectItem>
                  )
                )}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Temperature Range</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300"
                  placeholder="Min"
                  value={temperature.min}
                  onChange={(e) => setTemperature({ ...temperature, min: e.target.value })}
                />
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300"
                  placeholder="Max"
                  value={temperature.max}
                  onChange={(e) => setTemperature({ ...temperature, max: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Humidity (%)</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border-gray-300"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Wind Speed (km/h)</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border-gray-300"
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Special Conditions</label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={publicHoliday}
                  onChange={() => setPublicHoliday(!publicHoliday)}
                />
                <span className="ml-2">Public Holiday</span>
              </label>
            </div>
          </div>

          <Button size="lg" color="blue" className="w-full" onClick={handlePrediction}>
            Generate Prediction
          </Button>
        </div>
      </Card>

      <Card>
        <Title>Prediction Results</Title>
        <div className="mt-4">
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : predictionResult !== null ? (
            <p className="text-green-500 text-center">Predicted Consumption: {predictionResult}</p>
          ) : (
            <p className="text-gray-500 text-center">Run prediction to see results</p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Prediction;
