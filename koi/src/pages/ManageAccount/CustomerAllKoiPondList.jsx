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
import api from "../../config/axios"; // Import your axios configuration

export default function KoiPondList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  // Fetch API from backend using axios
  // const fetchCustomers = async () => {
  //   try {
  //     const response = await api.get("/api/user/getalluser"); // Use axios here
  //     setCustomers(response.data); // Assuming the data is directly in response.data
  //   } catch (error) {
  //     console.error(error.response.data);
  //     console.error(error.response.data);
  //     console.error(error.response.data);
  //   }
  // };

  // Call the API when the component first renders
  // useEffect(() => {
  //   fetchCustomers();
  // }, []);

  return (
    <TableContainer component={Paper}>
      <Table style={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ width: "20%" }}>
              ID
            </TableCell>
            <TableCell align="center" style={{ width: "30%" }}>
              Customer Name
            </TableCell>
            <TableCell align="center" style={{ width: "40%" }}>
              Email
            </TableCell>
            <TableCell align="center" style={{ width: "10%" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell align="center">{customer.id}</TableCell>
              <TableCell align="center">{customer.name}</TableCell>
              <TableCell align="center">{customer.email}</TableCell>
              <TableCell align="center">
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
