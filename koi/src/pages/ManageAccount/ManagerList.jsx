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
import api from "../../config/axios";
import DeleteUser from "./DeleteUser";
import ViewAccountModal from "./ViewAccountModal";

export default function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch manager data from API
  const fetchManagers = async () => {
    try {
      const response = await api.get("/api/user/getalluser", {
        headers: { accept: "application/json" },
      });
      const filteredManagers = response.data.filter(
        (user) => user.usertype === "Manager"
      );
      setManagers(filteredManagers);
    } catch (error) {
      console.error("Error fetching managers:", error);
      message.error("Failed to fetch managers. Please try again.");
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Handle manager registration
  const handleRegisterManager = async (values) => {
    try {
      await api.post("/api/auth/manager-register", values, {
        headers: { "Content-Type": "application/json" },
      });
      message.success("Manager registered successfully!");
      setIsRegisterModalVisible(false);
      form.resetFields();
      fetchManagers(); // Refresh the manager list
    } catch (error) {
      console.error("Error registering manager:", error);
      message.error("Failed to register manager. Please try again.");
    }
  };

  // Previous handlers remain the same
  const handleViewClick = (id) => {
    setSelectedManagerId(id);
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedManagerId(null);
  };

  const handleDeleteManager = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this manager?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/user/delete/${id}`, {
        headers: { accept: "application/json" },
      });
      setManagers(managers.filter((manager) => manager.userId !== id));
      message.success("Manager deleted successfully!");
    } catch (error) {
      console.error("Error deleting manager:", error);
      message.error("Failed to delete manager. Please try again.");
    }
  };

  return (
    <div>
      <Button
        type="primary"
        style={{
          marginBottom: "16px",
          backgroundColor: "rgb(180,0,0)",
          borderColor: "rgb(180,0,0)",
        }}
        onClick={() => setIsRegisterModalVisible(true)}
      >
        Create New Account
      </Button>

      {/* Registration Modal */}
      <Modal
        title="Register New Manager"
        open={isRegisterModalVisible}
        onCancel={() => {
          setIsRegisterModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleRegisterManager}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please input valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="userAddress"
            label="Address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="userPhoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please input phone number!" }]}
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
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Rest of the table code remains the same */}
      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }} aria-label="simple table">
          {/* ... existing table code ... */}
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  width: "5%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="center"
              >
                ID
              </TableCell>
              <TableCell
                style={{
                  width: "20%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Manager Name
              </TableCell>
              <TableCell
                style={{
                  width: "20%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Manager Phone
              </TableCell>
              <TableCell
                style={{
                  width: "25%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Email
              </TableCell>
              <TableCell
                style={{
                  width: "20%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Role
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
            {managers.map((manager) => (
              <TableRow key={manager.userId}>
                <TableCell style={{ width: "5%" }} align="center">
                  {manager.userId}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left">
                  {manager.username}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left">
                  {manager.userPhoneNumber}
                </TableCell>
                <TableCell style={{ width: "25%" }} align="left">
                  {manager.email}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left">
                  {manager.usertype}
                </TableCell>
                <TableCell style={{ width: "10%" }} align="center">
                  <Button
                    style={{ color: "rgb(180,0,0)", marginRight: "8px" }}
                    onClick={() => handleViewClick(manager.userId)}
                  >
                    View
                  </Button>
                  <DeleteUser
                    customerId={manager.userId}
                    onDelete={handleDeleteManager}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Account Modal */}
      {selectedManagerId && (
        <ViewAccountModal
          userId={selectedManagerId}
          visible={isViewModalVisible}
          onClose={handleViewModalClose}
        />
      )}
    </div>
  );
}
