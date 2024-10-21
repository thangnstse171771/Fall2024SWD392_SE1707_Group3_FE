import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Button, message, Modal, Spin } from "antd";
import api from "../../config/axios";
import ViewAccountModal from "./ViewAccountModal";

export default function PendingAccount() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false); // State for approve loading
  const [loadingReject, setLoadingReject] = useState(false); // State for reject loading
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/auth/pending-staff", {
        headers: { accept: "application/json" },
      });
      console.log("API Response:", response.data);
      setCustomers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      message.error("Failed to fetch customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleViewClick = (id) => {
    setSelectedCustomerId(id);
    setIsViewModalVisible(true);
  };
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

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedCustomerId(null);
  };

  const handleReviewClick = (customer) => {
    setSelectedCustomerDetails(customer);
    setIsReviewModalVisible(true);
  };

  const handleReviewModalClose = () => {
    setIsReviewModalVisible(false);
    setSelectedCustomerDetails(null);
  };

  const viewButtonStyle = {
    color: "rgb(180, 0, 0)",
    marginRight: "8px",
  };

  const reviewButtonStyle = {
    color: "rgb(0, 180, 0)",
  };

  const handleApprove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this account?"
    );
    if (!confirmed) return; // Nếu người dùng không xác nhận, thoát khỏi hàm

    setLoadingApprove(true); // Start loading for approve
    try {
      const response = await api.put(
        `/api/auth/approve-staff/${selectedCustomerDetails.userId}`
      );
      message.success("Account has been approved successfully!"); // Hiển thị thông báo thành công
      fetchCustomers(); // Cập nhật danh sách khách hàng
      handleReviewModalClose(); // Đóng modal review
    } catch (error) {
      console.error("Error approving account:", error);
      message.error("Failed to approve account. Please try again.");
    } finally {
      setLoadingApprove(false); // Stop loading for approve
    }
  };

  const handleReject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this account?"
    );
    if (!confirmed) return; // Nếu người dùng không xác nhận, thoát khỏi hàm

    setLoadingReject(true); // Start loading for reject
    try {
      const response = await api.put(
        `/api/auth/reject-staff/${selectedCustomerDetails.userId}`
      );
      message.success("Account has been rejected successfully!"); // Hiển thị thông báo thành công
      fetchCustomers(); // Cập nhật danh sách khách hàng
      handleReviewModalClose(); // Đóng modal review
    } catch (error) {
      console.error("Error rejecting account:", error);
      message.error("Failed to reject account. Please try again.");
    } finally {
      setLoadingReject(false); // Stop loading for reject
    }
  };

  return (
    <div>
      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      )}

      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  width: "15%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="center"
              >
                Request ID
              </TableCell>
              <TableCell
                style={{
                  width: "25%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Staff Name
              </TableCell>
              <TableCell
                style={{
                  width: "40%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Email
              </TableCell>
              <TableCell
                style={{
                  width: "10%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Status
              </TableCell>
              <TableCell
                style={{
                  width: "10%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="center"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.userId}>
                  <TableCell style={{ width: "5%" }} align="center">
                    {customer.userId}
                  </TableCell>
                  <TableCell style={{ width: "20%" }} align="left">
                    {customer.username}
                  </TableCell>
                  <TableCell style={{ width: "25%" }} align="left">
                    {customer.email}
                  </TableCell>
                  <TableCell style={{ width: "20%" }} align="left">
                    {customer.userStatus}
                  </TableCell>
                  <TableCell align="center" style={{ display: "flex" }}>
                    <Button
                      style={viewButtonStyle}
                      onClick={() => handleViewClick(customer.userId)}
                    >
                      View
                    </Button>
                    <Button
                      style={reviewButtonStyle}
                      onClick={() => handleReviewClick(customer)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No pending accounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedCustomerId && (
        <ViewAccountModal
          userId={selectedCustomerId}
          visible={isViewModalVisible}
          onClose={handleViewModalClose}
        />
      )}

      {selectedCustomerDetails && (
        <Modal
          title={`Review Account - ${selectedCustomerDetails.username}`}
          visible={isReviewModalVisible}
          onCancel={handleReviewModalClose}
          footer={[
            <Button
              style={{ backgroundColor: "red", color: "white" }}
              key="reject"
              type="danger"
              loading={loadingReject}
              onClick={handleReject}
            >
              Reject
            </Button>,
            <Button
              style={{ backgroundColor: "green" }}
              key="approve"
              type="primary"
              loading={loadingApprove}
              onClick={handleApprove}
            >
              Approve
            </Button>,
          ]}
        >
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
              <span style={valueStyle}>{selectedCustomerDetails.userId}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>
                <strong>Name:</strong>
              </span>
              <span style={valueStyle}>{selectedCustomerDetails.username}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>
                <strong>Email:</strong>
              </span>
              <span style={valueStyle}>{selectedCustomerDetails.email}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>
                <strong>Status:</strong>
              </span>
              <span style={valueStyle}>
                {selectedCustomerDetails.userStatus}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
