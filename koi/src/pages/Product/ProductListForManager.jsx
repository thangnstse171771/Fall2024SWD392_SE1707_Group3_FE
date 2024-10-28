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
import api from "../../config/axios";
import { Button } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ProductListForManger() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch product list
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/products/getAllProductsOrigin", {
        headers: {
          accept: "application/json",
        },
      });

      console.log("API Response:", response.data.data);

      if (response.data) {
        setProducts(response.data); // Assuming the API response contains the product list directly
      } else {
        setError("No product data found.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch product data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      <Table style={{ minWidth: 650 }} aria-label="product table">
        <TableHead>
          <TableRow>
            <TableCell style={tableHeaderStyle} align="center">
              PRODUCT ID
            </TableCell>
            <TableCell style={tableHeaderStyle} align="left">
              PRODUCT NAME
            </TableCell>
            <TableCell style={tableHeaderStyle} align="left">
              DESCRIPTION
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              PRICE
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              STATUS
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              USERNAME
            </TableCell>
            <TableCell style={tableHeaderStyle} align="center">
              ACTION
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.productId}>
              <TableCell align="center">{product.productId}</TableCell>
              <TableCell align="left">{product.productName}</TableCell>
              <TableCell align="left">{product.productDescription}</TableCell>
              <TableCell align="center">{product.productPrice}</TableCell>
              <TableCell
                align="center"
                style={{ color: "green", fontWeight: "bold" }}
              >
                {product.isActive}
              </TableCell>
              <TableCell align="center">{product.User.username}</TableCell>
              <TableCell align="center">
                <Button
                  style={{ color: "rgb(180,0,0)" }}
                  onClick={() =>
                    navigate(`/ProductDetails/${product.productId}`)
                  }
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
