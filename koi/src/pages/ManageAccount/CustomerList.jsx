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
import { Button, message, Modal, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import DeleteUser from "./DeleteUser";
import ViewAccountModal from "./ViewAccountModal";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isRequestAccountModalVisible, setIsRequestAccountModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/api/user/getalluser", {
        headers: { accept: "application/json" },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      message.error("Failed to fetch customers. Please try again.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleViewClick = (id) => {
    setSelectedCustomerId(id);
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedCustomerId(null);
  };

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

  const showRequestAccountModal = () => {
    setIsRequestAccountModalVisible(true);
  };

  const handleRequestAccountSubmit = async (values) => {
    try {
      const response = await api.post("/api/user/create", values);
      message.success("Account request submitted successfully!");
      setIsRequestAccountModalVisible(false);
      form.resetFields();
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error("Error submitting account request:", error);
      message.error("Failed to submit account request. Please try again.");
    }
  };

  return (
    <div>
      <Button
        onClick={showRequestAccountModal}
        type="primary"
        style={{
          marginBottom: 16,
          backgroundColor: "rgb(180,0,0)",
          borderColor: "rgb(180,0,0)",
        }}
      >
        Request Account
      </Button>

      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  width: "10%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="center"
              >
                ID
              </TableCell>
              <TableCell
                style={{
                  width: "30%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Customer Name
              </TableCell>
              <TableCell
                style={{
                  width: "20%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Customer Phone
              </TableCell>
              <TableCell
                style={{
                  width: "30%",
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
                align="center"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.userId}>
                <TableCell style={{ width: "10%" }} align="center">
                  {customer.userId}
                </TableCell>
                <TableCell style={{ width: "30%" }} align="left">
                  {customer.username}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left">
                  {customer.userPhoneNumber}
                </TableCell>
                <TableCell style={{ width: "30%" }} align="left">
                  {customer.email}
                </TableCell>
                <TableCell style={{ width: "10%" }} align="center">
                  <Button
                    style={{ color: "rgb(180,0,0)", marginRight: "8px" }}
                    onClick={() => handleViewClick(customer.userId)}
                  >
                    View
                  </Button>
                  <DeleteUser
                    customerId={customer.userId}
                    onDelete={handleDeleteCustomer}
                  />
                </TableCell>
              </TableRow>
            ))}
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

      <Modal
        title="Request Account"
        visible={isRequestAccountModalVisible}
        onCancel={() => setIsRequestAccountModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleRequestAccountSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="userType"
            label="User Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="customer">Customer</Select.Option>
              <Select.Option value="staff">Staff</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "rgb(180,0,0)",
                borderColor: "rgb(180,0,0)",
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
