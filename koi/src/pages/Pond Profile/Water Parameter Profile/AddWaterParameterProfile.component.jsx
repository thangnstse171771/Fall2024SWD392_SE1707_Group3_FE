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
        form={form} 
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields(); 
        }}
        layout="vertical"
        noValidate
      >
        <Form.Item
          name="temperature"
          label="Temperature (°C) (0 - 100)"
          rules={[
            { required: true, message: "Please input the temperature!" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Temperature cannot go below 0°C!")
                  );
                }
                if (value > 100) {
                  return Promise.reject(
                    new Error("Temperature cannot exceed 100°C!")
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
          label="Salt Level (%) (0 - 1)"
          rules={[
            { required: true, message: "Please input the salt level!" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Salt Level cannot go below 0%!")
                  );
                }
                if (value > 1) {
                  return Promise.reject(
                    new Error("Salt Level cannot exceed 1%!")
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
          label="pH Level (mg/L) (0 - 14)"
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
          label="Oxygen Level (mg/L) (0 - 20)"
          rules={[
            { required: true, message: "Please input the oxygen level!" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Oxygen Level must be at least 0 mg/L!")
                  );
                }
                if (value > 20) {
                  return Promise.reject(
                    new Error("Oxygen Level cannot exceed 20 mg/L!")
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
          label="Nitrite (NO₂⁻) (mg/L) (0 - 1)"
          rules={[
            { required: true, message: "Please input the nitrite level!" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Nitrite Level cannot go below 0 mg/L!")
                  );
                }
                if (value > 1) {
                  return Promise.reject(
                    new Error("Nitrite Level cannot exceed 1 mg/L!")
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
          label="Nitrate (NO₃⁻) (mg/L) (0 - 100)"
          rules={[
            { required: true, message: "Please input the nitrate level!" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Nitrate Level cannot go below 0 mg/L!")
                  );
                }
                if (value > 100) {
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
          label="Phosphate (mg/L) (0 - 2)"
          rules={[
            { required: true, message: "Please input the phosphate level!" },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject(
                    new Error("Phosphate Level cannot go below 0 mg/L!")
                  );
                }
                if (value > 2) {
                  return Promise.reject(
                    new Error("Phosphate Level cannot exceed 2 mg/L!")
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
              form.resetFields(); 
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
