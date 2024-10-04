import React, { useState } from "react";
import { TextField, Grid, Button as MuiButton } from "@mui/material";
import { Layout, Card, Button as AntButton } from "antd";

const { Content } = Layout;

const MyKoi = () => {
  // Initial pond data
  const [pond, setPond] = useState({
    pondID: "P123456", // Non-editable
    pondName: "Chuong 3 con soi",
    pondSize: 0,
    pondImage: "",
    pondVolume: 0,
    pondDepth: 0,
    drainNumber: 0,
    pumpCapacity: 0,
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPond((prevPond) => ({
      ...prevPond,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Submit pond data to backend (e.g., API call)
    console.log("Submitted Pond Data:", pond);
  };

  return (
    <Layout style={{ minHeight: "90vh", padding: "24px" }}>
      <Content>
        <Card
          title="Koi Pond Profile"
          bordered={true}
          style={{ width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pond ID"
                value={pond.pondID}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pond Name"
                name="pondName"
                value={pond.pondName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pond Size (sq.m.)"
                name="pondSize"
                type="number"
                value={pond.pondSize}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pond Image URL"
                name="pondImage"
                value={pond.pondImage}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pond Volume (L)"
                name="pondVolume"
                type="number"
                value={pond.pondVolume}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pond Depth (m)"
                name="pondDepth"
                type="number"
                value={pond.pondDepth}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Drain Number"
                name="drainNumber"
                type="number"
                value={pond.drainNumber}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pump Capacity (L/min)"
                name="pumpCapacity"
                type="number"
                value={pond.pumpCapacity}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <MuiButton
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </MuiButton>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default MyKoi;
