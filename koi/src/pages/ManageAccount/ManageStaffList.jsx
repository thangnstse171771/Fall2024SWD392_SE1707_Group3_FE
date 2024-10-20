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

export default function StaffList() {
  const [staffs, setStaffs] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isRequestAccountModalVisible, setIsRequestAccountModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchStaffs = async () => {
    try {
      const response = await api.get("/api/user/getallstaff", {
        headers: { accept: "application/json" },
      });
      setStaffs(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching staffs:", error);
      message.error("Failed to fetch staffs. Please try again.");
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleViewClick = (id) => {
    setSelectedStaffId(id);
    setIsViewModalVisible(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setSelectedStaffId(null);
  };

  const handleDeleteStaff = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/user/delete/${id}`, {
        headers: { accept: "application/json" },
      });
      setStaffs(staffs.filter((staff) => staff.userId !== id));
      message.success("Staff deleted successfully!");
    } catch (error) {
      console.error("Error deleting staff:", error);
      message.error("Failed to delete staff. Please try again.");
    }
  };

  // Updated handleRequestAccountSubmit to use /api/auth/staff-register
  // const handleRequestAccountSubmit = async (values) => {
  //   try {
  //     await api.post("/api/auth/staff-register", values); // Updated API endpoint
  //     message.success("Account request submitted successfully!");
  //     setIsRequestAccountModalVisible(false);
  //     form.resetFields();
  //     fetchStaffs(); // Refresh the staff list
  //   } catch (error) {
  //     console.error("Error submitting account request:", error);
  //     message.error("Failed to submit account request. Please try again.");
  //   }
  // };
  const handleRequestAccountSubmit = async (values) => {
    // Map form values to the correct field names expected by the API
    const payload = {
      username: values.username,
      email: values.email,
      userAddress: values.address, // The API expects "userAddress"
      userPhoneNumber: values.phone, // The API expects "userPhoneNumber"
    };

    try {
      await api.post("/api/auth/staff-register", payload); // Send mapped payload
      message.success("Account request submitted successfully!");
      setIsRequestAccountModalVisible(false);
      form.resetFields();
      fetchStaffs(); // Refresh the staff list
    } catch (error) {
      console.error("Error submitting account request:", error);
      message.error("Failed to submit account request. Please try again.");
    }
  };

  return (
    <div>
      <Button
        onClick={() => setIsRequestAccountModalVisible(true)}
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
                Staff Name
              </TableCell>
              <TableCell
                style={{
                  width: "20%",
                  fontWeight: "bold",
                  color: "rgb(180,0,0)",
                }}
                align="left"
              >
                Staff Phone
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
            {staffs.map((staff) => (
              <TableRow key={staff.userId}>
                <TableCell style={{ width: "5%" }} align="center">
                  {staff.userId}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left">
                  {staff.username}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left">
                  {staff.userPhoneNumber}
                </TableCell>
                <TableCell style={{ width: "25%" }} align="left">
                  {staff.email}
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left">
                  {staff.usertype}
                </TableCell>
                <TableCell style={{ width: "10%" }} align="center">
                  <Button
                    style={{ color: "rgb(180,0,0)", marginRight: "8px" }}
                    onClick={() => handleViewClick(staff.userId)}
                  >
                    View
                  </Button>
                  <DeleteUser
                    staffId={staff.userId}
                    onDelete={handleDeleteStaff}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedStaffId && (
        <ViewAccountModal
          userId={selectedStaffId}
          visible={isViewModalVisible}
          onClose={handleViewModalClose}
        />
      )}

      {/* Modal for requesting account */}
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
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter an email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter a phone number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter an address" }]}
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
