import React, { useState } from "react";
import { Card, Button, Modal, Form, Input, Select } from "antd";
import { useLocation } from "react-router-dom";
import CountrySelect from "react-select-country-list";
import "./KoiInformation.scss";

const { Option, OptGroup } = Select;

const KoiInformation = ({ koi, onUpdate, ponds }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const viewOnly = location.state?.viewOnly || false;

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

  const handleEdit = () => {
    if (!viewOnly) {
      form.setFieldsValue({
        name: koi.koiName,
        image: koi.koiImage,
        gender: koi.koiGender,
        breed: koi.koiBreed,
        origin: koi.koiOrigin,
        pondId: koi.currentPondId,
      });
      setIsEditing(true);
    }
  };

  const handleUpdateKoi = async (values) => {
    const formattedValues = {
      koiName: values.name,
      koiImage: values.image,
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
            src={koi.koiImage}
            alt={koi.koiName}
            className="koi-profile__image"
          />
          <h1 className="koi-profile__title">{koi.koiName}</h1>
        </div>
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
        <p>
          <strong>Current Pond ID:</strong> {koi.currentPondId}
        </p>
        {!viewOnly && (
          <div className="edit-btn-container">
            <Button className="edit-btn" onClick={handleEdit}>
              Edit
            </Button>
          </div>
        )}
      </Card>

      <Modal
        className="edit-modal"
        title="Edit Koi Information"
        visible={isEditing && !viewOnly}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateKoi}>
          <Form.Item
            name="name"
            label="Koi Name"
            rules={[{ required: true, message: "Please input the koi name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: "Please input the image URL!" }]}
          >
            <Input />
          </Form.Item>
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
            rules={[{ required: true, message: "Please input the origin!" }]}
          >
            <Select placeholder="Select country">
              {CountrySelect()
                .getData()
                .map((country) => (
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
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-btn">
              Update Koi Fish
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default KoiInformation;
