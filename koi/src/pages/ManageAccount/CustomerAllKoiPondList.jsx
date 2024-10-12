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

export default function CustomerAllKoiPondList() {
  const [allPonds, setAllPonds] = useState([]);
  const [PondDetails, setPondDetails] = useState([]);
  const navigate = useNavigate();

  // Fetch API from backend using axios
  const fetchAllPonds = async () => {
    try {
      const response = await api.get("/api/pond/getAllPonds", {
        headers: {
          accept: "application/json",
        },
      });
      setAllPonds(response.data); // Assuming the data is directly in response.data
      setPondDetails = allPonds.data;
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  // Call the API when the component first renders
  useEffect(() => {
    fetchAllPonds();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table style={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                width: "20%",
                fontWeight: "bold",
                color: "rgb(180,0,0)",
              }}
              align="center"
            >
              POND ID
            </TableCell>
            <TableCell
              style={{
                width: "30%",
                fontWeight: "bold",
                color: "rgb(180,0,0)",
              }}
              align="left"
            >
              POND NAME
            </TableCell>
            <TableCell
              style={{
                width: "30%",
                fontWeight: "bold",
                color: "rgb(180,0,0)",
              }}
              align="left"
            >
              OWNER
            </TableCell>

            <TableCell
              style={{
                width: "20%",
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
          {allPonds.map((pond) => (
            <TableRow key={pond.pondId}>
              <TableCell style={{ width: "20%" }} align="center">
                {pond.pondId}
              </TableCell>
              <TableCell style={{ width: "30%" }} align="left">
                {pond.pondName}
              </TableCell>
              <TableCell style={{ width: "20%" }} align="left">
                {/* {pond.User.username} */}
              </TableCell>

              <TableCell style={{ width: "20%" }} align="center">
                <Button
                  style={{ color: "rgb(180,0,0)" }}
                  onClick={() => navigate(`/`)}
                >
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
