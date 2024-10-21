import React from "react";
import { Button } from "antd";

export default function DeleteUser({ customerId, onDelete }) {
  const userType = localStorage.getItem("usertype");
  return (
    <>
      {userType === "Admin" && (
        <Button
          style={{ color: "rgb(180,0,0)" }}
          onClick={() => onDelete(customerId)} // Gọi hàm xóa với customerId
        >
          Delete
        </Button>
      )}
    </>
  );
}
