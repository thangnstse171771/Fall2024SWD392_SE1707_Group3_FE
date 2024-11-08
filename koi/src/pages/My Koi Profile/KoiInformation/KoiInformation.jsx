import React, { useState } from "react";
import { Card, Button, Modal, Form, Input, Select, Alert } from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../firebase";
import CountrySelect from "react-select-country-list";
import { CircularProgress } from "@mui/material";
import "./KoiInformation.scss";

const { Option, OptGroup } = Select;

const KoiInformation = ({ koi, onUpdate, ponds }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({ image: koi.koiImage });

  const koiBreeds = [
    {
      category: "Gosanke",
      breeds: [
        { name: "Kohaku", description: "white koi with red pattern" },
        { name: "Taisho Sanke", description: "white koi with red and black" },
        {
          name: "Showa Sanshoku",
          description: "black koi with red and white patterns",
        },
      ],
    },
    {
      category: "Utsuri",
      breeds: [
        { name: "Hi Utsuri", description: "black and red" },
        { name: "Shiro Utsuri", description: "white" },
        { name: "Ki Utsuri", description: "yellow" },
        { name: "Utsurimono", description: "white and black dot" },
      ],
    },
    {
      category: "Tancho",
      breeds: [{ name: "Tancho", description: "1 red dot on head (rare)" }],
    },
    {
      category: "Asagi",
      breeds: [
        {
          name: "Asagi",
          description: "muted blue-grey and bright red markings",
        },
      ],
    },
    {
      category: "Butterfly Koi",
      breeds: [
        {
          name: "Butterfly Koi",
          description: "symmetric both sides like a butterfly",
        },
      ],
    },
    {
      category: "Ogon",
      breeds: [
        { name: "Platinum Ogon", description: "solid shiny silver-white" },
        {
          name: "Yamabuki Ogon",
          description: "gold, yellow, or bronze shades",
        },
      ],
    },
  ];

  const countries = CountrySelect().getData();

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
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
          setFormData({ ...formData, image: downloadURL });
        });
      }
    );
  };

  const handleEdit = () => {
    form.setFieldsValue({
      name: koi.koiName,
      gender: koi.koiGender,
      breed: koi.koiBreed,
      origin: koi.koiOrigin,
      pondId: koi.currentPondId,
    });
    setIsEditing(true);
  };

  const handleUpdateKoi = async (values) => {
    const koiNameTrimmed = values.name.trim();

    if (!koiNameTrimmed) {
      return Modal.error({
        title: "Validation Error",
        content: "Koi name must contain at least one word!",
      });
    }

    const formattedValues = {
      koiName: koiNameTrimmed,
      koiImage: formData.image,
      koiGender: values.gender,
      koiBreed: values.breed,
      koiOrigin: values.origin,
      currentPondId: parseInt(values.pondId),
    };

    await onUpdate(formattedValues);
    setIsEditing(false);
  };

  return (
    <>
      <Card className="koi-info-card" title="Koi Information">
        <div className="koi-profile__header">
          <img
            src={formData.image}
            alt={koi.koiName}
            className="koi-profile__image"
          />
          <h1 className="koi-profile__title">{koi.koiName}</h1>
        </div>
        {/* Koi details */}
        <p>
          <strong>Name:</strong> {koi.koiName}
        </p>
        <p>
          <strong>Gender:</strong> {koi.koiGender}
        </p>
        <p>
          <strong>Breed:</strong> {koi.koiBreed}
        </p>
        <p>
          <strong>Origin:</strong> {koi.koiOrigin || "N/A"}
        </p>

        <div className="edit-btn-container">
          <Button className="edit-btn" onClick={handleEdit}>
            Edit
          </Button>
        </div>
      </Card>

      <Modal
        className="edit-modal"
        title="Edit Koi Information"
        visible={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdateKoi}>
          <Form.Item
            name="name"
            label="Koi Name"
            rules={[
              { required: true, message: "Please input the koi name!" },
              {
                validator: (_, value) =>
                  value && value.trim() === ""
                    ? Promise.reject("Koi name must contain at least one word!")
                    : Promise.resolve(),
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Image Upload Section */}
          <div className="upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setFormData({ ...formData, image: null });
              }}
              className="upload-input"
            />
            <Button
              type="button"
              onClick={handleUploadImage}
              disabled={imageUploadProgress}
              className="upload-btn"
            >
              {imageUploadProgress ? (
                <CircularProgress
                  variant="determinate"
                  value={imageUploadProgress}
                />
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>

          {imageUploadError && (
            <div className="error-message">
              <Alert message={imageUploadError} type="error" showIcon />
            </div>
          )}

          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Koi Fish" />
            </div>
          )}

          {/* Other form fields */}
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="breed"
            label="Breed"
            rules={[{ required: true, message: "Please select the breed!" }]}
          >
            <Select placeholder="Select breed">
              {koiBreeds.map((category) => (
                <OptGroup label={category.category} key={category.category}>
                  {category.breeds.map((breed) => (
                    <Option value={breed.name} key={breed.name}>
                      {breed.name} - {breed.description}
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="origin"
            label="Origin"
            rules={[{ required: true, message: "Please select the origin!" }]}
          >
            <Select placeholder="Select country">
              {countries.map((country) => (
                <Option key={country.value} value={country.value}>
                  {country.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="form-footer">
            <Button type="primary" htmlType="submit">
              Update Koi Fish
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default KoiInformation;
