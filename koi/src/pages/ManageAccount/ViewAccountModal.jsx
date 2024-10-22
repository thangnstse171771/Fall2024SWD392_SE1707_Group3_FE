import React, { useState, useEffect } from "react";
import { Modal, Spin, Alert } from "antd";
import api from "../../config/axios"; // Axios instance

export default function ViewAccountModal({ userId, visible, onClose }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch thông tin chi tiết khi modal mở
  useEffect(() => {
    if (visible && userId) {
      fetchAccountDetails();
    }
  }, [visible, userId]);

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/user/${userId}`, {
        headers: {
          accept: "application/json",
        },
      });
      setAccount(response.data);
      console.log(response.data);

      setLoading(false);
    } catch (error) {
      setError("Failed to fetch account details.");
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<span style={titleStyle}>Account Information</span>}
      visible={visible}
      onCancel={onClose}
      footer={[
        <button
          key="close"
          onClick={onClose}
          style={{
            backgroundColor: "rgb(180, 0, 0)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Close
        </button>,
      ]}
      // bodyStyle={{
      //   fontFamily: "Arial, sans-serif",
      //   padding: "20px",
      //   color: "#333",
      //   lineHeight: "1.6",
      // }}
    >
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={infoRowStyle}>
            <span style={labelStyle}>
              <strong>ID:</strong>
            </span>
            <span style={valueStyle}>{account?.userId || "N/A"}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>
              <strong>Username:</strong>
            </span>
            <span style={valueStyle}>{account?.username || "N/A"}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>
              <strong>Email:</strong>
            </span>
            <span style={valueStyle}>{account?.email || "N/A"}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>
              <strong>User Type:</strong>
            </span>
            <span style={valueStyle}>{account?.usertype || "N/A"}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>
              <strong>Status:</strong>
            </span>
            <span style={valueStyle}>
              {account?.status ? (
                <span style={{ color: "green" }}>Active</span>
              ) : (
                <span style={{ color: "red" }}>Pending</span>
              )}
            </span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>
              <strong>Phone:</strong>
            </span>
            <span style={valueStyle}>{account?.userPhoneNumber || "N/A"}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={labelStyle}>
              <strong>Address:</strong>
            </span>
            <span style={valueStyle}>{account?.userAddress || "N/A"}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}

// Styles
const titleStyle = {
  fontSize: "24px", // Tăng kích thước chữ
  color: "rgb(0, 102, 204)", // Màu xanh nước biển
  fontWeight: "bold",
  textAlign: "center",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #ddd",
  padding: "8px 0",
};

const labelStyle = {
  color: "rgb(180, 0, 0)",
  fontWeight: "bold",
};

const valueStyle = {
  color: "#333",
};
