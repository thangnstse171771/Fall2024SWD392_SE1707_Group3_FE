import React, { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./WaterParameters.scss";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const generateLast7DaysData = (pond) => {
  const labels = [];
  const temperatureData = [];
  const saltData = [];
  const pHData = [];
  const o2Data = [];
  const no2Data = [];
  const no3Data = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString());

    temperatureData.push(Math.random() * 10 + 20);
    saltData.push(Math.random() * 3 + 5);
    pHData.push((Math.random() * 1 + 6.5).toFixed(1));
    o2Data.push((Math.random() * 2 + 5).toFixed(1));
    no2Data.push((Math.random() * 0.3).toFixed(2));
    no3Data.push((Math.random() * 0.5 + 1).toFixed(2));
  }

  return {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatureData,
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
      {
        label: "Salt (g/L)",
        data: saltData,
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
      },
      {
        label: "pH",
        data: pHData,
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
      {
        label: "O2 (mg/L)",
        data: o2Data,
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
    ],
    no2Data,
    no3Data,
  };
};

const WaterParameters = () => {
  const [selectedPond, setSelectedPond] = useState("Pond A");
  const { labels, datasets, no2Data, no3Data } =
    generateLast7DaysData(selectedPond);

  const barData = {
    labels,
    datasets: [
      {
        label: "NO2 (mg/L)",
        data: no2Data,
        backgroundColor: "rgba(255, 159, 64, 0.5)",
      },
      {
        label: "NO3 (mg/L)",
        data: no3Data,
        backgroundColor: "rgba(255, 205, 86, 0.5)",
      },
    ],
  };

  const checkWaterQuality = () => {
    const warnings = [];
    if (datasets[0].data[datasets[0].data.length - 1] > 24) {
      warnings.push("Temperature is too high (> 24°C)");
    }
    if (datasets[1].data[datasets[1].data.length - 1] > 7) {
      warnings.push("Salt level is too high (> 7g/L)");
    }
    if (datasets[2].data[datasets[2].data.length - 1] < 6.5) {
      warnings.push("pH level is too low (< 6.5)");
    }
    return warnings.length > 0
      ? warnings
      : ["All parameters are within standards."];
  };

  return (
    <div className="water-parameters-page">
      <h1>Water Parameters Monitoring</h1>
      <div>
        <label htmlFor="pond-select">Select Pond: </label>
        <select
          id="pond-select"
          value={selectedPond}
          onChange={(e) => setSelectedPond(e.target.value)}
        >
          <option value="Pond A">Pond A</option>
          <option value="Pond B">Pond B</option>
          <option value="Pond C">Pond C</option>
        </select>
      </div>
      <div className="charts">
        <div className="chart-container">
          <h2>Line Chart</h2>
          <Line data={{ labels, datasets }} />
        </div>
        <div className="chart-container">
          <h2>Bar Chart</h2>
          <Bar data={barData} />
        </div>
      </div>
      <h2>Warnings:</h2>
      <ul className="warnings-list">
        {checkWaterQuality().map((warning, index) => (
          <li key={index}>{warning}</li>
        ))}
      </ul>
    </div>
  );
};

export default WaterParameters;
