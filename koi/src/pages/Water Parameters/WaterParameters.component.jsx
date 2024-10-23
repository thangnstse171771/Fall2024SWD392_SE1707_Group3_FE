import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import api from "../../config/axios"; // Import the axios instance
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

const WaterParameters = () => {
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [waterData, setWaterData] = useState(null);

  useEffect(() => {
    // Fetch all ponds for the user
    const fetchPonds = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await api.get("/api/pond/getAllPondsByUser", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data.success) {
          const activePonds = response.data.data.filter(
            (pond) => pond.status === "active"
          );
          setPonds(activePonds);
          if (activePonds.length > 0) {
            setSelectedPond(activePonds[0].pondId); // Set default to the first active pond
          }
        } else {
          console.error("Failed to fetch ponds.");
        }
      } catch (error) {
        console.error("Error fetching ponds:", error);
      }
    };

    fetchPonds();
  }, []);

  useEffect(() => {
    if (selectedPond) {
      // Fetch water parameters for the selected pond
      const fetchWaterParameters = async () => {
        const token = sessionStorage.getItem("token");

        try {
          const response = await api.get(
            `/api/waterPara/pond/${selectedPond}/all`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );

          if (response.data) {
            // Sort the water data by recordDate in ascending order
            const sortedData = response.data.sort(
              (a, b) => new Date(a.recordDate) - new Date(b.recordDate)
            );
            setWaterData(sortedData); // Set sorted data to state
          } else {
            console.error("Failed to fetch water parameters.");
          }
        } catch (error) {
          console.error("Error fetching water parameters:", error);
        }
      };

      fetchWaterParameters();
    }
  }, [selectedPond]);

  const handlePondSelect = (event) => {
    setSelectedPond(event.target.value);
  };

  const formatLabels = (data) => {
    const dateCount = {};

    // Count occurrences of each date
    data.forEach((entry) => {
      const date = new Date(entry.recordDate).toLocaleDateString();
      dateCount[date] = (dateCount[date] || 0) + 1;
    });

    // Format the labels with date and time where necessary
    return data.map((entry) => {
      const date = new Date(entry.recordDate);
      const formattedDate = date.toLocaleDateString();

      if (dateCount[formattedDate] > 1) {
        // If the date occurs more than once, append the time (hh:mm)
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
      if (latestData.temperature > 24) {
        warnings.push("Temperature is too high (> 24°C)");
      }
      if (latestData.pondSaltLevel > 7) {
        warnings.push("Salt level is too high (> 7g/L)");
      }
      if (latestData.pondPHLevel < 6.5) {
        warnings.push("pH level is too low (< 6.5)");
      }
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
          onChange={handlePondSelect}
        >
          {ponds.map((pond) => (
            <option key={pond.pondId} value={pond.pondId}>
              {pond.pondName}
            </option>
          ))}
        </select>
      </div>
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
