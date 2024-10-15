import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function CustomerAllKoiPondList() {
  const [allPonds, setAllPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAllPonds = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/pond/getAllPonds", {
        headers: {
          accept: "application/json",
        },
      });

      console.log("API Response:", response.data); // Kiểm tra log dữ liệu API

      let pondsData = response.data;

      // Đảm bảo dữ liệu được lấy từ key "data"
      if (response.data && response.data.data) {
        pondsData = response.data.data;
      }

      // Đảm bảo dữ liệu là một mảng
      if (!Array.isArray(pondsData)) {
        pondsData = [pondsData]; // Chuyển sang mảng nếu không phải là mảng
      }

      setAllPonds(pondsData);
    } catch (error) {
      console.error("Error fetching:", error);
      setError("Failed to fetch pond data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPonds();
  }, []);

  const tableHeaderStyle = {
    fontWeight: "bold",
    color: "rgb(180,0,0)",
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table style={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              style={{ ...tableHeaderStyle, width: "20%" }}
              align="center"
            >
              POND ID
            </TableCell>
            <TableCell
              style={{ ...tableHeaderStyle, width: "30%" }}
              align="left"
            >
              POND NAME
            </TableCell>
            <TableCell
              style={{ ...tableHeaderStyle, width: "30%" }}
              align="left"
            >
              OWNER
            </TableCell>
            <TableCell
              style={{ ...tableHeaderStyle, width: "20%" }}
              align="center"
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allPonds.map((pond, index) => (
            <TableRow key={pond.pondId || index}>
              <TableCell style={{ width: "20%" }} align="center">
                {pond.pondId}
              </TableCell>
              <TableCell style={{ width: "30%" }} align="left">
                {pond.pondName}
              </TableCell>
              <TableCell style={{ width: "30%" }} align="left">
                {/* Lấy giá trị username từ nested object "User" */}
                {pond.User?.username || "N/A"}
              </TableCell>
              <TableCell style={{ width: "20%" }} align="center">
                <Button
                  style={{ color: "rgb(180,0,0)" }}
                  onClick={() => navigate(`/pond/${pond.pondId}`)}
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
