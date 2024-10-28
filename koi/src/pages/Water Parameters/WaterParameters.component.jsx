import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import api from "../../config/axios";
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

const WaterParameters = ({ pondId }) => {
  const [waterData, setWaterData] = useState(null);

  useEffect(() => {
    if (pondId) {
      const fetchWaterParameters = async () => {
        const token = sessionStorage.getItem("token");

        try {
          const response = await api.get(`/api/waterPara/pond/${pondId}/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          if (response.data) {
            const sortedData = response.data.sort(
              (a, b) => new Date(a.recordDate) - new Date(b.recordDate)
            );
            setWaterData(sortedData);
          } else {
            console.error("Failed to fetch water parameters.");
          }
        } catch (error) {
          console.error("Error fetching water parameters:", error);
        }
      };

      fetchWaterParameters();
    }
  }, [pondId]);

  const formatLabels = (data) => {
    const dateCount = {};

    data.forEach((entry) => {
      const date = new Date(entry.recordDate).toLocaleDateString();
      dateCount[date] = (dateCount[date] || 0) + 1;
    });

    return data.map((entry) => {
      const date = new Date(entry.recordDate);
      const formattedDate = date.toLocaleDateString();

      if (dateCount[formattedDate] > 1) {
        const time = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${formattedDate} ${time}`;
      } else {
        return formattedDate;
      }
    });
  };

  const checkWaterQuality = () => {
    const warnings = [];
    if (waterData) {
      const latestData = waterData[waterData.length - 1];
      if (latestData.temperature > 24) warnings.push("Temperature is too high (> 24°C)");
      if (latestData.pondSaltLevel > 7) warnings.push("Salt level is too high (> 7g/L)");
      if (latestData.pondPHLevel < 6.5) warnings.push("pH level is too low (< 6.5)");
    }
    return warnings.length > 0 ? warnings : ["All parameters are within standards."];
  };

  return (
    <div className="water-parameters-page">
      <h1>Water Parameters Monitoring</h1>
      <div className="charts">
        <div className="chart-container">
          <h2>Line Chart</h2>
          {waterData && (
            <Line
              data={{
                labels: formatLabels(waterData),
                datasets: [
                  {
                    label: "Temperature (°C)",
                    data: waterData.map((entry) => entry.temperature),
                    borderColor: "rgba(255, 99, 132, 1)",
                    fill: false,
                  },
                  {
                    label: "Salt (g/L)",
                    data: waterData.map((entry) => entry.pondSaltLevel),
                    borderColor: "rgba(54, 162, 235, 1)",
                    fill: false,
                  },
                  {
                    label: "pH",
                    data: waterData.map((entry) => entry.pondPHLevel),
                    borderColor: "rgba(75, 192, 192, 1)",
                    fill: false,
                  },
                  {
                    label: "O2 (mg/L)",
                    data: waterData.map((entry) => entry.pondOxygenLevel),
                    borderColor: "rgba(153, 102, 255, 1)",
                    fill: false,
                  },
                ],
              }}
            />
          )}
        </div>
        <div className="chart-container">
          <h2>Bar Chart</h2>
          {waterData && (
            <Bar
              data={{
                labels: formatLabels(waterData),
                datasets: [
                  {
                    label: "NO2 (mg/L)",
                    data: waterData.map((entry) => entry.pondNitrite),
                    backgroundColor: "rgba(255, 159, 64, 0.5)",
                  },
                  {
                    label: "NO3 (mg/L)",
                    data: waterData.map((entry) => entry.pondNitrate),
                    backgroundColor: "rgba(255, 205, 86, 0.5)",
                  },
                ],
              }}
            />
          )}
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
