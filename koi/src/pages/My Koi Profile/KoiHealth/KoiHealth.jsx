import React from "react";
import { Card } from "antd";

const KoiHealth = ({ koi }) => {
  return (
    <Card title="Koi Health" style={{ marginBottom: 16 }}>
      <p>
        <strong>Health Status:</strong> {koi.healthStatus || "N/A"}
      </p>
      {}
    </Card>
  );
};

export default KoiHealth;
