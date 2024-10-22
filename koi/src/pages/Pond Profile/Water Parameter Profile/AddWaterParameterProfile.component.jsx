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
      title="Water Parameter"
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
        noValidate
      >
        <Form.Item
          name="temperature"
          label="Temperature (°C)"
          rules={[
            { required: true, message: "Please input the temperature!" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Temperature cannot go below 0°C!")
                  );
                }
                if (value > 40) {
                  return Promise.reject(
                    new Error("Temperature cannot exceed 40°C!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
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
          rules={[
            { required: true, message: "Please input the salt level!" },
            {
              validator: (_, value) => {
                if (value < 0.1) {
                  return Promise.reject(
                    new Error("Salt Level must be at least 0.1%!")
                  );
                }
                if (value > 0.7) {
                  return Promise.reject(
                    new Error("Salt Level cannot exceed 0.7%!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
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
          label="pH Level (mg/L)"
          rules={[
            { required: true, message: "Please input the pH level!" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("pH level cannot go below 0 mg/L!")
                  );
                }
                if (value > 14) {
                  return Promise.reject(
                    new Error("pH level cannot exceed 14 mg/L!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
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
            {
              validator: (_, value) => {
                if (value < 1) {
                  return Promise.reject(
                    new Error("Oxygen Level must be at least 1 mg/L!")
                  );
                }
                if (value > 15) {
                  return Promise.reject(
                    new Error("Oxygen Level cannot exceed 15 mg/L!")
                  );
                }
                return Promise.resolve();
              },
            },
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
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Nitrite Level cannot go below 0 mg/L!")
                  );
                }
                if (value > 0.75) {
                  return Promise.reject(
                    new Error("Oxygen Level cannot exceed 0.75 mg/L!")
                  );
                }
                return Promise.resolve();
              },
            },
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
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Nitrate Level cannot go below 0 mg/L!")
                  );
                }
                if (value > 80) {
                  return Promise.reject(
                    new Error("Nitrate Level cannot exceed 80 mg/L!")
                  );
                }
                return Promise.resolve();
              },
            },
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
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Phosphate Level cannot go below 0 mg/L!")
                  );
                }
                if (value > 1) {
                  return Promise.reject(
                    new Error("Phosphate Level cannot exceed 1 mg/L!")
                  );
                }
                return Promise.resolve();
              },
            },
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
