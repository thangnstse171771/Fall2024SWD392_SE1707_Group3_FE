import { useState, useEffect } from "react";
import "./MyPond.scss";

import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddPondPopup from "./AddPondPopup.component";
import api from "../../config/axios";

function MyPond() {
  const [pond1Data, setPond1Data] = useState([]);
  const [open, setOpen] = useState(false);

  const [pondData, setPondData] = useState({
    pondName: "",
    pondImage: "",
    pondSize: "",
    pondDepth: "",
    pondVolume: "",
    pondDrains: "",
    pondAeroCapacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const showPopup = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPondData({
      ...pondData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post("/api/pond/createPond", {
        pondName: pondData.pondName,
        pondImage: pondData.pondImage,
        pondSize: parseFloat(pondData.pondSize), // Assuming pondSize is a number
        pondDepth: parseFloat(pondData.pondDepth),
        pondVolume: parseFloat(pondData.pondVolume),
        pondDrains: parseInt(pondData.pondDrains),
        pondAeroCapacity: parseInt(pondData.pondAeroCapacity),
      });

      setSuccess("Pond Created Successfully");
      setPondData({
        pondName: "",
        pondImage: "",
        pondSize: "",
        pondDepth: "",
        pondVolume: "",
        pondDrains: "",
        pondAeroCapacity: "",
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (newPond) => {
  //   try {
  //     // POST request to add a new pond to the API
  //     const response = await fetch(
  //       "https://66fa93b3afc569e13a9c472e.mockapi.io/api/KoiLake/Lake",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newPond),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Error adding pond");
  //     }

  //     const data = await response.json();
  //     setPondData([...pondData, data]); // Update local state with the newly added pond
  //     setOpen(false);
  //   } catch (error) {
  //     console.error("Error adding pond:", error);
  //   }
  // };

  useEffect(() => {
    const fetchPond1Data = async () => {
      try {
        const response = await fetch(
          "https://66fa93b3afc569e13a9c472e.mockapi.io/api/KoiLake/Lake"
        );
        const data = await response.json();
        setPond1Data(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPond1Data();
  }, []);

  return (
    <div className="my-pond-page">
      <div className="my-pond-page-header">
        <div>
          <h1>Ponds</h1>
        </div>
        <div>
          <button onClick={showPopup} className="add-pond-button">
            Add Pond
          </button>
          <AddPondPopup
            open={open}
            onSubmit={handleSubmit}
            handleCancel={handleCancel}
            pondData={pondData} // Pass pondData object
            handleInputChange={handleInputChange} // Pass handleInputChange
            loading={loading}
          />
        </div>
      </div>
      <div className="my-pond-page-body">
        <table className="pond-table">
          <thead className="pond-table-head">
            <tr>
              <th>Pond Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="pond-table-body">
            {pond1Data.map((pond) => (
              <tr key={pond.id}>
                <td>{pond.pondName}</td>
                <td className="lake-action-buttons">
                  <Button
                    size="large"
                    className="edit-lake-button"
                    icon={<EditOutlined />}
                  />
                  <Button
                    size="large"
                    className="delete-lake-button"
                    icon={<DeleteOutlined />}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyPond;
