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

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  // Fetch API
  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/getalluser");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Call API when component renders
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table style={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "20%" }}>ID</TableCell>
            <TableCell style={{ width: "30%" }} align="center">
              Customer Name
            </TableCell>
            <TableCell style={{ width: "40%" }} align="center">
              Email
            </TableCell>
            <TableCell style={{ width: "10%" }} align="center">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell align="right">{customer.name}</TableCell>
              <TableCell align="right">{customer.email}</TableCell>
              <TableCell align="right">
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
