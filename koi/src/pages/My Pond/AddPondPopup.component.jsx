import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Input, Button, message, Slider } from "antd";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgress } from "@mui/material";

const AddPondPopup = ({
  open,
  onSubmit,
  handleCancel,
  pondData,
  handleInputChange,
  loading,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [pondVolume, setPondVolume] = useState(null);
  const [aeroCapacityRange, setAeroCapacityRange] = useState([0, 0]);

  useEffect(() => {
    if (pondVolume) {
      setAeroCapacityRange([pondVolume * 1.5, pondVolume * 2]);
    }
  }, [pondVolume]);

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

  useEffect(() => {
    if (handleCancel) {
      setImagePreview("");
      setFile(null);
      setImageUploadProgress(null);
      setImageUploadError(null);
      setAeroCapacityRange([0, 0]);
      form.resetFields();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, form]);

  return (
    <Modal
      title="Add New Pond"
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields();
        }}
        layout="vertical"
        noValidate
      >
        <Form.Item
          label="Pond Name"
          name="pondName"
          rules={[{ required: true, message: "Please input the pond name!" }]}
        >
          <Input
            value={pondData.pondName}
            onChange={handleInputChange}
            placeholder="Enter pond name"
          />
        </Form.Item>

        <Form.Item
          label="Pond Image URL"
          name="pondImage"
          rules={[
            {
              required: true,
              message: "Please upload or input the pond image URL!",
            },
          ]}
        >
          <Input
            type="hidden"
            value={pondData.pondImage}
            onChange={handleInputChange}
            placeholder="Enter or upload pond image URL"
            readOnly
          />
          <Input type="file" onChange={handleFileChange} ref={fileInputRef} />
          {imageUploadProgress ? (
            <div className="w-16 h-16">
              <CircularProgress
                variant="determinate"
                value={imageUploadProgress}
                style={{ marginTop: "8px" }}
              />
            </div>
          ) : (
            <div>
              <Button onClick={handleUploadImage} style={{ marginTop: "8px" }}>
                Upload Image
              </Button>
              {imageUploadError && (
                <p
                  style={{
                    color: "red",
                    marginTop: "0",
                    marginBottom: "0",
                    textAlign: "left",
                  }}
                >
                  {imageUploadError}
                </p>
              )}
            </div>
          )}
        </Form.Item>

        {imagePreview && (
          <div style={{ margin: "10px 0" }}>
            <img
              src={imagePreview}
              alt="Pond"
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
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
          <Input type="number" placeholder="Pond size" />
        </Form.Item>

        <Form.Item
          label="Pond Depth (m) (0.9 - 3)"
          name="pondDepth"
          rules={[
            { required: true, message: "Please input the pond depth!" },
            {
              validator: (_, value) => {
                if (value < 0.9) {
                  return Promise.reject(
                    new Error("Pond depth must be at least 0.9 meters!")
                  );
                }
                if (value > 3) {
                  return Promise.reject(
                    new Error("Pond depth cannot exceed 3 meters!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            value={pondData.pondDepth}
            onChange={handleInputChange}
            placeholder="Enter pond depth"
          />
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
          <Input
            type="number"
            onChange={(e) => {
              handleInputChange(e);
              setPondVolume(parseFloat(e.target.value));
            }}
            placeholder="Enter pond volume"
          />
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
          <Input
            type="number"
            value={pondData.pondDrains}
            onChange={handleInputChange}
            placeholder="Enter pond drains"
          />
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
                      "Pond aeration capacity must be between 1.5 or 2 times the volume!"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Slider
            min={aeroCapacityRange[0]}
            max={aeroCapacityRange[1]}
            onChange={(value) =>
              handleInputChange({ target: { name: "pondAeroCapacity", value } })
            }
            value={pondData.pondAeroCapacity}
            tooltip={{ formatter: (value) => `${value.toFixed(2)} m³/hour` }}
            step={0.01}
          />
        </Form.Item>

        <Form.Item
          label="Pond Capacity of Koi Fish (<= Volume) "
          name="pondCapacityOfKoiFish"
          rules={[
            {
              required: true,
              message: "Please input the pond capacity of koi fish!",
            },
            {
              validator: async (_, value) => {
                const pondVolume = form.getFieldValue("pondVolume");

                const parsedValue = parseFloat(value);
                const parsedVolume = parseFloat(pondVolume);

                if (value < 1) {
                  return Promise.reject(
                    new Error("Pond Capacity can't be below 1!")
                  );
                }

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
            value={pondData.pondCapacityOfKoiFish}
            onChange={handleInputChange}
            placeholder="Enter pond aeration capacity"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" danger htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button
            onClick={() => {
              form.resetFields(); // Reset form on cancel button click
              handleCancel();
            }}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPondPopup;
