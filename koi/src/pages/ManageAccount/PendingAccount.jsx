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
import { Button, message, Modal, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import DeleteUser from "./DeleteUser";
import ViewAccountModal from "./ViewAccountModal";

export default function PendingAccount() {
  const [customers, setCustomers] = useState([]); // Ensure customers is an array by default
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch customer data from API
  const fetchCustomers = async () => {
    try {
      const response = await api.get("/api/auth/pending-staff", {
        headers: { accept: "application/json" },
      });
      console.log("API Response:", response.data); // Log API response to inspect

      // Access the correct 'data' array from the response
      setCustomers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      message.error("Failed to fetch customers. Please try again.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle viewing a customer account
  const handleViewClick = (id) => {
    setSelectedCustomerId(id);
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedCustomerId(null);
  };

  // Handle deleting a customer account
  const handleDeleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/user/delete/${id}`, {
        headers: { accept: "application/json" },
      });
      setCustomers(customers.filter((customer) => customer.userId !== id));
      message.success("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      message.error("Failed to delete customer. Please try again.");
    }
  };

  return (
    <div>
      {/* Table to display all accounts */}
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
            {Array.isArray(customers) && customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.userId}>
                  <TableCell style={{ width: "5%" }} align="center">
                    {customer.userId}
                  </TableCell>
                  <TableCell style={{ width: "20%" }} align="left">
                    {customer.username}
                  </TableCell>
                  {/* <TableCell style={{ width: "20%" }} align="left">
                    {customer.userPhoneNumber}
                  </TableCell> */}
                  <TableCell style={{ width: "25%" }} align="left">
                    {customer.email}
                  </TableCell>
                  <TableCell style={{ width: "20%" }} align="left">
                    {customer.userStatus}
                  </TableCell>
                  <TableCell style={{ width: "10%" }} align="center">
                    <Button
                      style={{ color: "rgb(180,0,0)", marginRight: "8px" }}
                      onClick={() => handleViewClick(customer.userId)}
                    >
                      View
                    </Button>
                    {/* <DeleteUser
                      customerId={customer.userId}
                      onDelete={handleDeleteCustomer}
                    /> */}
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

      {/* View Account Modal */}
      {selectedCustomerId && (
        <ViewAccountModal
          userId={selectedCustomerId}
          visible={isViewModalVisible}
          onClose={handleViewModalClose}
        />
      )}
    </div>
  );
}
