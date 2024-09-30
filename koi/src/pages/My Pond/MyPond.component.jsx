import { useState, useEffect } from "react";
import "./MyPond.scss";

import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

function MyPond() {
  const [pondData, setPondData] = useState([]);

  useEffect(() => {
    const fetchPondData = async () => {
      try {
        const response = await fetch(
          "https://66fa93b3afc569e13a9c472e.mockapi.io/api/KoiLake/Lake"
        );
        const data = await response.json();
        setPondData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPondData();
  }, []);

  return (
    <div className="my-pond-page">
      <div className="my-pond-page-header">
        <div>
          <h1>Ponds</h1>
        </div>
        <div>
          <button className="add-pond-button">Add Pond</button>
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
            {pondData.map((pond) => (
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
