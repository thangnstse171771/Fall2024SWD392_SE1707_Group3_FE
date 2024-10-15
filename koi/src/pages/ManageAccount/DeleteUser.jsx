import React from "react";
import { Button } from "antd";

export default function DeleteUser({ customerId, onDelete }) {
  return (
    <Button
      style={{ color: "rgb(180,0,0)" }}
      onClick={() => onDelete(customerId)} // Gọi hàm xóa với customerId
    >
      Delete
    </Button>
  );
}
