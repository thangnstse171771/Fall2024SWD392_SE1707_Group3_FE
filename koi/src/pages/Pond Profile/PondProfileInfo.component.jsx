import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button } from "antd";
import api from "../../config/axios";
import "./PondProfile.scss";
import { toast } from "react-toastify";

const PondProfileInfo = () => {
  const { id } = useParams();

  const [form] = Form.useForm(); // Create form instance
  const [loading, setLoading] = useState(true); // For loading state
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("token");

  // Function to fetch pond details
  const fetchPondDetails = async () => {
    try {
      const response = await api.get(`/api/pond/getPondById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pondData = response.data.data;

      setProfile(pondData);
      form.setFieldsValue(pondData); // Set form fields with fetched data
    } catch (err) {
      setError(err.response?.data?.message);
      toast.error(err.response?.data?.message || "Failed to load pond data.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await api.put(
        `/api/pond/updatePond/${id}`,
        {
          pondName: values.pondName,
          pondImage: values.pondImage,
          pondSize: parseFloat(values.pondSize),
          pondDepth: parseFloat(values.pondDepth),
          pondVolume: parseFloat(values.pondVolume),
          pondDrains: parseInt(values.pondDrains),
          pondAeroCapacity: parseInt(values.pondAeroCapacity),
          pondCapacityOfKoiFish: parseInt(values.pondCapacityOfKoiFish),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Pond updated successfully!");
        fetchPondDetails(); // Fetch updated pond details
        form.resetFields(); // Reset form fields after successful submit
      } else {
        throw new Error("Failed to update pond.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update pond.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch pond details when the component mounts
  useEffect(() => {
    fetchPondDetails();
  }, []);

  return (
    <div className="pond-profile-info">
      {error ? (
        <div>
          <h3>{error}</h3>
        </div>
      ) : (
        <>
          <img
            className="koi-profile-img"
            src={
              profile.pondImage ||
              "https://cdn11.bigcommerce.com/s-c81ee/product_images/uploaded_images/ridersuperone-1-.jpg"
            }
            alt={profile.pondName}
          />
          <div className="pond-form-container">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              noValidate
            >
              <Form.Item
                label="Pond Name"
                name="pondName"
                rules={[
                  { required: true, message: "Please input the pond name!" },
                ]}
              >
                <Input placeholder="Enter pond name" />
              </Form.Item>

              <Form.Item
                label="Pond Image URL"
                name="pondImage"
                rules={[
                  {
                    required: true,
                    message: "Please input the pond image URL!",
                  },
                ]}
              >
                <Input placeholder="Enter pond image URL" />
              </Form.Item>

              <Form.Item
                label="Pond Size (m²)"
                name="pondSize"
                rules={[
                  { required: true, message: "Please input the pond size!" },
                  {
                    validator: (_, value) => {
                      if (value < 3) {
                        return Promise.reject(
                          new Error("Pond size must be at least 3 m²!")
                        );
                      }
                      if (value > 33) {
                        return Promise.reject(
                          new Error("Pond size cannot exceed 33 m²!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" placeholder="Enter pond size" />
              </Form.Item>

              <Form.Item
                label="Pond Depth (m)"
                name="pondDepth"
                rules={[
                  { required: true, message: "Please input the pond depth!" },
                  {
                    validator: (_, value) => {
                      if (value > 2) {
                        return Promise.reject(
                          new Error("Pond depth cannot exceed 2 meters!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" placeholder="Enter pond depth" />
              </Form.Item>

              <Form.Item
                label="Pond Volume (m³)"
                name="pondVolume"
                rules={[
                  { required: true, message: "Please input the pond volume!" },
                  {
                    validator: (_, value) => {
                      if (value < 1.3) {
                        return Promise.reject(
                          new Error("Pond volume must be at least 1.3 m³!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" placeholder="Enter pond volume" />
              </Form.Item>

              <Form.Item
                label="Pond Drains"
                name="pondDrains"
                rules={[
                  {
                    required: true,
                    message: "Please input the number of pond drains!",
                  },
                  {
                    validator: (_, value) => {
                      if (value < 1) {
                        return Promise.reject(
                          new Error("There must be at least 1 pond drain!")
                        );
                      }
                      if (value > 2) {
                        return Promise.reject(
                          new Error("There can't be more than 2 pond drains!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" placeholder="Enter pond drains" />
              </Form.Item>

              <Form.Item
                label="Pond Aeration Capacity (m³/hour)"
                name="pondAeroCapacity"
                rules={[
                  {
                    required: true,
                    message: "Please input the pond aeration capacity!",
                  },
                  {
                    validator: (_, value) => {
                      const pondVolume = form.getFieldValue("pondVolume");
                      if (value < pondVolume * 1.5 || value > pondVolume * 2) {
                        return Promise.reject(
                          new Error(
                            "Pond aeration capacity must be between 1.5 and 2 times the volume!"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter pond aeration capacity"
                />
              </Form.Item>

              <Form.Item
                label="Pond Capacity of Koi Fish"
                name="pondCapacityOfKoiFish"
                rules={[
                  {
                    required: true,
                    message: "Please input the pond capacity of koi fish!",
                  },
                  {
                    validator: async (_, value) => {
                      const pondVolume = form.getFieldValue("pondVolume");
              
                      // Ensure we parse the values to numbers for proper comparison
                      const parsedValue = parseFloat(value);
                      const parsedVolume = parseFloat(pondVolume);
              
                      if (isNaN(parsedValue) || isNaN(parsedVolume)) {
                        return Promise.reject(new Error("Invalid input values."));
                      }
              
                      if (parsedValue > parsedVolume) {
                        return Promise.reject(
                          new Error("Fish capacity can't exceed pond volume!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter pond capacity of koi fish"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  loading={loading}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

export default PondProfileInfo;
