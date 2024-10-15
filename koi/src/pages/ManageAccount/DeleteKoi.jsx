import React from "react";
import { Button } from "antd";

export default function DeleteKoi({ koiId, onDelete }) {
  return (
    <Button
      style={{ color: "rgb(180,0,0)" }}
      onClick={() => onDelete(koiId)} // Gọi hàm xóa với customerId
    >
      Delete
    </Button>
  );
}
