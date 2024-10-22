import React from "react";
import { Modal, Input, Form, Button, Select } from "antd";

const { Option, OptGroup } = Select;

const AddKoiFishPopup = ({ open, onSubmit, handleCancel, ponds }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const formattedValues = {
      koiName: values.name,
      koiImage: values.image,
      koiGender: values.gender,
      koiBreed: values.breed,
      koiOrigin: values.origin,
      price: parseFloat(values.price),
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

  // Predefined countries (example)
  const countries = ["Vietnam", "Japan", "China", "USA", "Thailand"];

  return (
    <Modal
      title="Add Koi Fish"
      visible={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Koi Name"
          rules={[
            { required: true, message: "Please input the koi name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image URL"
          rules={[
            { required: true, message: "Please input the image URL!" },
            {
              type: "url",
              message: "Please enter a valid URL!",
            },
          ]}
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
          rules={[
            { required: true, message: "Please input the origin!" },
            {
              validator: (_, value) =>
                countries.includes(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error("Origin must be one of the predefined countries!")),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[
            { required: true, message: "Please input the price!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="pondId"
          label="Current Pond"
          rules={[{ required: true, message: "Please select a pond!" }]}
        >
          <Select placeholder="Select a pond">
            {ponds.map((pond) => (
              <Option key={pond.pondId} value={pond.pondId}>
                {pond.pondName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Koi Fish
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddKoiFishPopup;
