import { Modal, Input, Button, Form, Select } from "antd";
import CountrySelect from "react-select-country-list";
const { Option, OptGroup } = Select;

const AddFishInProfile = ({ open, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm();

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
    <Modal title="Add New Fish" open={open} onCancel={onCancel} footer={null}>
      <Form
        form={form} // Bind the form instance
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields(); // Reset form after successful submit
        }}
        layout="vertical"
        noValidate
      >
        <Form.Item
          label="Koi Name"
          name="koiName"
          rules={[{ required: true, message: "Please enter the Koi name!" }]}
        >
          <Input placeholder="Enter Koi name" />
        </Form.Item>

        <Form.Item
          label="Koi Image URL"
          name="koiImage"
          rules={[{ required: true, message: "Please provide an image URL!" }]}
        >
          <Input placeholder="Enter Koi image URL" />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="koiGender"
          rules={[{ required: true, message: "Please select the gender!" }]}
        >
          <Select placeholder="Select gender">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="koiBreed"
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
          label="Koi Origin (Country)"
          name="koiOrigin"
          rules={[
            { required: true, message: "Please select the country of origin!" },
          ]}
        >
          <Select
            showSearch
            placeholder="Select country"
            options={countries.map((country) => ({
              value: country.label,
              label: country.label,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price!" }]}
        >
          <Input type="number" placeholder="Enter price in USD" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" danger htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button
            onClick={() => {
              form.resetFields(); // Reset form on cancel button click
              onCancel();
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

export default AddFishInProfile;
