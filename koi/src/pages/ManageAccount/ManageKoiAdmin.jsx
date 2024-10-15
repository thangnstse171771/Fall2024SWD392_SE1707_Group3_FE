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
import DeleteKoi from "./DeleteKoi"; // Assuming DeleteKoi component is in the same directory
import api from "../../config/axios";
import { Button } from "antd";

export default function ManageKoiAdmin() {
  const [koiFish, setKoiFish] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch danh sách Koi
  const fetchKoiFish = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/koi/getAllKoi", {
        headers: {
          accept: "application/json",
        },
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.data) {
        setKoiFish(response.data.data); // Lấy data từ response
      } else {
        setError("No koi data found.");
      }
    } catch (error) {
      console.error("Error fetching koi fish:", error);
      setError("Failed to fetch koi fish data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa Koi
  const deleteKoiFish = async (fishId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this koi fish?"
    );
    if (!confirmDelete) return;
    try {
      await api.delete(`/api/koi/deleteKoi/${fishId}`);
      // Xóa thành công, cập nhật lại danh sách koi
      setKoiFish(koiFish.filter((koi) => koi.fishId !== fishId));
    } catch (error) {
      console.error("Failed to delete koi fish:", error);
      alert("Failed to delete koi fish. Please try again later.");
    }
  };

  useEffect(() => {
    fetchKoiFish();
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
      <Table style={{ minWidth: 650 }} aria-label="koi table">
        <TableHead>
          <TableRow>
            <TableCell style={tableHeaderStyle} align="center">
              FISH ID
            </TableCell>
            <TableCell style={tableHeaderStyle} align="left">
              KOI NAME
            </TableCell>
            <TableCell style={tableHeaderStyle} align="left">
              KOI IMAGE
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              GENDER
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              BREED
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              ORIGIN
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              PRICE
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              CURRENT POND ID
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              ACTION
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {koiFish.map((koi) => (
            <TableRow key={koi.fishId}>
              <TableCell align="center">{koi.fishId}</TableCell>
              <TableCell align="left">{koi.koiName}</TableCell>
              <TableCell align="left">
                <img
                  src={
                    koi.koiImage.startsWith("http")
                      ? koi.koiImage
                      : `https://your-api-url.com/${koi.koiImage}`
                  }
                  alt={koi.koiName}
                  style={{ width: "100px", height: "auto" }}
                />
              </TableCell>
              <TableCell align="center">{koi.koiGender}</TableCell>
              <TableCell align="center">{koi.koiBreed}</TableCell>
              <TableCell align="center">{koi.koiOrigin || "N/A"}</TableCell>
              <TableCell align="center">{koi.price || "N/A"}</TableCell>
              <TableCell align="center">{koi.currentPondId}</TableCell>
              <TableCell align="center">
                <Button>View</Button>

                <DeleteKoi koiId={koi.fishId} onDelete={deleteKoiFish} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
