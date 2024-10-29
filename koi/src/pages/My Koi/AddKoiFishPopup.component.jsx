import React from "react";
import { Modal, Input, Form, Button, Select } from "antd";
import CountrySelect from "react-select-country-list";

const { Option, OptGroup } = Select;

const AddKoiFishPopup = ({ open, onSubmit, handleCancel, ponds }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const koiNameTrimmed = values.name.trim();

    // Kiểm tra xem tên có ít nhất một từ không
    if (!koiNameTrimmed) {
      return Modal.error({
        title: "Validation Error",
        content: "Koi name must contain at least one word!",
      });
    }

    const formattedValues = {
      koiName: koiNameTrimmed,
      koiImage: values.image.trim(),
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
