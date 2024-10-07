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
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios"; // Ensure this path is correct for your Axios instance

export default function StaffList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  // Fetch API using Axios
  //   const fetchCustomers = async () => {
  //     try {
  //       const response = await api.get("/api/user/getalluser", {
  //         headers: {
  //           accept: "application/json",
  //         },
  //       });
  //       setCustomers(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Error fetching customers:", error);
  //       // Optionally, handle error UI here
  //     }
  //   };

  // Call API when component renders
  //   useEffect(() => {
  //     fetchCustomers();
  //   }, []);

  return (
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
            <TableRow key={customer.id}>
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
                <Button onClick={() => navigate(`/customer/${customer.id}`)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
