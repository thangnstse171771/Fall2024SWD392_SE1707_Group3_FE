import React, { useState, useEffect } from "react";
import { Button } from "antd";
import {
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
  Paper,
} from "@mui/material";
import api from "../../../config/axios";
import AddRecommendations from "./AddRecommendations";

const ManageRecommendations = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [waterParameters, setWaterParameters] = useState([]);

  const showPopup = () => {
    setOpen(true);
  };

  const hidePopup = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recommendationsRes, categoriesRes, waterParametersRes] =
        await Promise.all([
          api.get("/api/productRecommends/getAllProductRecommends"),
          api.get("/api/categories/getAllCategories"),
          api.get("/api/waterPara/getAllWaterParameter"),
        ]);

      setRecommendations(recommendationsRes.data);
      setCategories(categoriesRes.data);
      setWaterParameters(waterParametersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to get category name by categoryId
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "Unknown Category";
  };

  // Helper function to get pond name by waterParameterId
  const getPondName = (waterParameterId) => {
    const parameter = waterParameters.find(
      (param) => param.waterParameterId === waterParameterId
    );
    return parameter ? parameter.Pond.pondName : "Unknown Pond";
  };

  const tableStyles = {
    container: {
      width: "100%",
      margin: "20px auto",
      borderRadius: "8px",
      overflow: "hidden",
    },
    headCell: {
      fontWeight: "bold",
      color: "rgb(180,0,0)",
      padding: "10px",
      width: "20%",
    },
    bodyRow: {},
    bodyCell: {},
  };

  return (
    <div>
      <Button
        type="primary"
        style={{
          marginBottom: 16,
          backgroundColor: "rgb(180,0,0)",
          borderColor: "rgb(180,0,0)",
        }}
        onClick={showPopup}
      >
        Create New Recommendation
      </Button>
      <AddRecommendations
        isOpen={open}
        onClose={hidePopup}
        categories={categories}
        waterParameters={waterParameters}
        onAddSuccess={fetchData} // Refresh data on successful add
      />

      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} style={tableStyles.container}>
          <TableHead>
            <TableRow>
              <TableCell style={tableStyles.headCell} align="center">
                ID
              </TableCell>
              <TableCell style={tableStyles.headCell} align="center">
                CATEGORY
              </TableCell>
              <TableCell style={tableStyles.headCell} align="center">
                POND
              </TableCell>
              <TableCell style={tableStyles.headCell} align="center">
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recommendations.map((rec) => (
              <TableRow key={rec.id} style={tableStyles.bodyRow} hover>
                <TableCell align="center" style={tableStyles.bodyCell}>
                  {rec.recommendId}
                </TableCell>
                <TableCell align="center" style={tableStyles.bodyCell}>
                  {getCategoryName(rec.categoryId)}
                </TableCell>
                <TableCell align="center" style={tableStyles.bodyCell}>
                  {getPondName(rec.waterParameterId)}
                </TableCell>
                <TableCell align="center" style={tableStyles.bodyCell}>
                  <Button
                    style={{ color: "rgb(180,0,0)" }}
                    // onClick={() =>
                    //   navigate(`/ProductDetails/${product.productId}`)
                    // }
                  >
                    View
                  </Button>
                  <Button
                    style={{ color: "red", marginLeft: "8px" }}
                    // onClick={() => handleRemoveProduct(product.productId)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      )}
    </div>
  );
};

export default ManageRecommendations;
