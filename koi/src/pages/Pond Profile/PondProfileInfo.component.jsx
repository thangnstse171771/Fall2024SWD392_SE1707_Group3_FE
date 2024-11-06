import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import api from "../../config/axios";
import "./PondProfile.scss";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgress } from "@mui/material";

const PondProfileInfo = ({ refresh }) => {
  const { id } = useParams();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const token = sessionStorage.getItem("token");

  const userType = localStorage.getItem("usertype");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageUploadError(null);
  };

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    setImageUploadError(null);

    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          form.setFieldsValue({ pondImage: downloadURL });
          setImagePreview(downloadURL);
          message.success("Image uploaded successfully!");
        });
      }
    );
  };

  const fetchPondDetails = async () => {
    try {
      const response = await api.get(`/api/pond/getPondById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pondData = response.data.data;

      setProfile(pondData);
      form.setFieldsValue(pondData);
    } catch (err) {
      setError(err.response?.data?.message);
      toast.error(err.response?.data?.message || "Failed to load pond data.");
    } finally {
      setLoading(false);
    }
  };

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
          pondAeroCapacity: parseFloat(values.pondAeroCapacity),
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
        fetchPondDetails();
        form.resetFields();
      } else {
        throw new Error("Failed to update pond.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update pond.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = () => {
    fetchPondDetails();
    setFile(null);

    setImageUploadProgress(null);
    setImageUploadError(null);

    form.setFieldsValue({ pondImage: profile.pondImage || "" });
    setImagePreview(profile.pondImage || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchPondDetails();
  }, [refresh]);

  return (
    <div>
      {error ? (
        <div>
          <h3>{error}</h3>
        </div>
      ) : (
        <div className="pond-profile-info">
          <img
            className="koi-profile-img"
            src={imagePreview ? imagePreview : profile.pondImage}
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

              {userType === "Customer" && (
                <>
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
                    <Input placeholder="Pond image URL" readOnly />
                  </Form.Item>

                  <Form.Item>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    {imageUploadProgress ? (
                      <div className="w-16 h-16">
                        <CircularProgress
                          variant="determinate"
                          value={imageUploadProgress}
                          style={{ marginTop: "8px" }}
                        />
                      </div>
                    ) : (
                      <Button
                        onClick={handleUploadImage}
                        style={{ marginTop: "8px" }}
                      >
                        Upload Image
                      </Button>
                    )}
                  </Form.Item>

                  {imageUploadError && (
                    <p style={{ color: "red" }}>{imageUploadError}</p>
                  )}
                </>
              )}

              <Form.Item
                label="Pond Size (m²) (3 - 33)"
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
                label="Pond Depth (m) (0.9 - 3)"
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
                label="Pond Volume (m³) (>= 1.3)"
                name="pondVolume"
                rules={[
                  { required: true, message: "Please input the pond volume!" },
                  {
                    validator: (_, value) => {
                      const pondSize = form.getFieldValue("pondSize");
                      const pondDepth = form.getFieldValue("pondDepth");
                      const multiply = pondSize * pondDepth;

                      if (value < 1.3) {
                        return Promise.reject(
                          new Error("Pond volume must be at least 1.3 m³!")
                        );
                      }
                      if (value > multiply + 1) {
                        return Promise.reject(
                          new Error(`Volume cant exceed ${multiply + 1} m³!`)
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
                label="Pond Drains (1 - 2)"
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
                label="Pond Aeration Capacity (m³/hour) (Volume * 1.5 or * 2)"
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
                            "Pond aeration capacity must be between 1.5 or 2 times the volume!"
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
                label="Pond Capacity of Koi Fish  (<= Volume) "
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
                        return Promise.reject(
                          new Error("Invalid input values.")
                        );
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

              <div className="pond-profile-button-group">
                <div>
                  Pond Slots:{" "}
                  {profile.pondCapacity
                    ? profile.pondCapacity.currentCount
                    : "N/A"}
                  /{profile.pondCapacityOfKoiFish}
                </div>
                {userType === "Customer" && (
                  <div>
                    <Button
                      onClick={handleRevert}
                      style={{ marginRight: "8px" }}
                    >
                      Revert
                    </Button>
                    <Button
                      type="primary"
                      danger
                      htmlType="submit"
                      loading={loading}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PondProfileInfo;
