import React, { useState } from "react";
import { Modal, Input, Form, Button, Select, Alert } from "antd";
import CountrySelect from "react-select-country-list";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgress } from "@mui/material";
import "./AddKoiFishPopup.scss";

const { Option, OptGroup } = Select;

const AddKoiFishPopup = ({ open, onSubmit, handleCancel, ponds }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});

  const handleUploadImage = async () => {
    try {
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
            form.setFieldsValue({ koiImage: downloadURL });
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleFinish = (values) => {
    const koiNameTrimmed = values.name.trim();

    if (!koiNameTrimmed) {
      return Modal.error({
        title: "Validation Error",
        content: "Koi name must contain at least one word!",
      });
    }

    const formattedValues = {
      koiName: koiNameTrimmed,
      koiImage: formData.image || values.koiImage,
      koiGender: values.gender,
      koiBreed: values.breed,
      koiOrigin: values.origin,
      currentPondId: parseInt(values.pondId),
    };

    onSubmit(formattedValues);
    form.resetFields();
  };

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

  return (
    <Modal
      title="Add Koi Fish"
      visible={open}
      onCancel={handleCancel}
      footer={null}
      className="add-koi-popup"
    >
      <Form form={form} onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Koi Name"
          rules={[
            { required: true, message: "Please input the koi name!" },
            {
              validator: (_, value) => {
                if (value && value.trim() === "") {
                  return Promise.reject(
                    new Error("Koi name must contain at least one word!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Image Upload Section */}
        <Form.Item
          label="Koi Image URL"
          name="koiImage"
          rules={[
            {
              required: true,
              message: "Please upload or input the koi image URL!",
            },
          ]}
        >
          <Input type="hidden" value={formData.image || ""} readOnly />
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
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
            <Button onClick={handleUploadImage} style={{ marginTop: "8px" }}>
              Upload Image
            </Button>
          )}
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
        </Form.Item>

        {formData.image && (
          <div className="image-preview">
            <img src={formData.image} alt="Koi Fish" />
          </div>
        )}

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

        <Form.Item
          name="pondId"
          label="Current Pond"
          rules={[{ required: true, message: "Please select a pond!" }]}
        >
          <Select placeholder="Select a pond">
            {ponds
              .filter((pond) => pond.status === "active")
              .map((pond) => (
                <Option key={pond.pondId} value={pond.pondId}>
                  {pond.pondName}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item className="form-footer">
          <Button type="primary" htmlType="submit">
            Add Koi Fish
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddKoiFishPopup;
