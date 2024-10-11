import React from "react";
import { Card } from "antd";

const KoiRecord = ({ koi }) => {
  return (
    <Card title="Koi Record" style={{ marginBottom: 16 }}>
      {}
      <p>Last Feeding: {koi.lastFeeding || "N/A"}</p>
      <p>Last Health Check: {koi.lastHealthCheck || "N/A"}</p>
    </Card>
  );
};

export default KoiRecord;
