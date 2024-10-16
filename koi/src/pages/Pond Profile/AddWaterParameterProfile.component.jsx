import { Modal, Input, Button, Form } from "antd";

const AddWaterParameterProfile = ({
  open,
  handleCancel,
  onSubmit,
  addParameter,
  handleInputChange,
  loading,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add New Pond"
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form} // Bind the form instance
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields(); // Reset form after successful submit
        }}
        layout="vertical"
      >
        <Form.Item
          name="temperature"
          label="Temperature (°C)"
          rules={[{ required: true, message: "Please input the temperature!" }]}
        >
          <Input
            type="number"
            value={addParameter.temperature}
            onChange={handleInputChange}
            placeholder="Enter temperature"
          />
        </Form.Item>

        <Form.Item
          name="pondSaltLevel"
          label="Salt Level (%)"
          rules={[{ required: true, message: "Please input the salt level!" }]}
        >
          <Input
            type="number"
            value={addParameter.pondSaltLevel}
            onChange={handleInputChange}
            placeholder="Enter salt level"
          />
        </Form.Item>

        <Form.Item
          name="pondPHLevel"
          label="Ph Level (mg/L)"
          rules={[{ required: true, message: "Please input the pH level!" }]}
        >
          <Input
            type="number"
            value={addParameter.pondPHLevel}
            onChange={handleInputChange}
            placeholder="Enter pH level"
          />
        </Form.Item>

        <Form.Item
          name="pondOxygenLevel"
          label="Oxygen Level (mg/L)"
          rules={[
            { required: true, message: "Please input the oxygen level!" },
          ]}
        >
          <Input
            type="number"
            value={addParameter.pondOxygenLevel}
            onChange={handleInputChange}
            placeholder="Enter oxygen level"
          />
        </Form.Item>

        <Form.Item
          name="pondNitrite"
          label="Nitrite (mg/L)"
          rules={[
            { required: true, message: "Please input the nitrite level!" },
          ]}
        >
          <Input
            type="number"
            value={addParameter.pondNitrite}
            onChange={handleInputChange}
            placeholder="Enter nitrite level"
          />
        </Form.Item>

        <Form.Item
          name="pondNitrate"
          label="Nitrate (mg/L)"
          rules={[
            { required: true, message: "Please input the nitrate level!" },
          ]}
        >
          <Input
            type="number"
            value={addParameter.pondNitrate}
            onChange={handleInputChange}
            placeholder="Enter nitrate level"
          />
        </Form.Item>

        <Form.Item
          name="pondPhosphate"
          label="Phosphate (mg/L)"
          rules={[
            { required: true, message: "Please input the phosphate level!" },
          ]}
        >
          <Input
            type="number"
            value={addParameter.pondPhosphate}
            onChange={handleInputChange}
            placeholder="Enter phosphate level"
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

export default AddWaterParameterProfile;
