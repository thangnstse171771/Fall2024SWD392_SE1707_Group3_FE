import React from "react";
import { Modal, Form, Input, Button } from "antd";

const UpdateWaterParameterProfile = ({
  openUpdate,
  handleCancelUpdate,
  handleUpdateSubmit,
  handleUpdateChange,
  updateParameter,
  loading,
}) => {

  return (
    <Modal
      title="Update Water Parameter Profile"
      visible={openUpdate}
      onCancel={handleCancelUpdate}
      footer={null}
    >
      <Form
        layout="vertical"
        onFinish={handleUpdateSubmit}
        initialValues={updateParameter}
      >
        <Form.Item
          label="Temperature (°C) (0 - 100)"
          name="temperature"
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
            name="temperature"
            type="number"
            placeholder="Enter temperature (°C)"
            onChange={handleUpdateChange}
          />
        </Form.Item>

        <Form.Item
          label="Salt Level (%) (0 - 1)"
          name="pondSaltLevel"
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
            name="pondSaltLevel"
            type="number"
            placeholder="Enter salt level (%)"
            onChange={handleUpdateChange}
          />
        </Form.Item>

        <Form.Item
          label="pH Level (mg/L) (0 - 14)"
          name="pondPHLevel"
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
            name="pondPHLevel"
            type="number"
            placeholder="Enter pH level (mg/L)"
            onChange={handleUpdateChange}
          />
        </Form.Item>

        <Form.Item
          label="Oxygen Level (mg/L) (0 - 20)"
          name="pondOxygenLevel"
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
            name="pondOxygenLevel"
            type="number"
            placeholder="Enter oxygen level (mg/L)"
            onChange={handleUpdateChange}
          />
        </Form.Item>

        <Form.Item
          label="Nitrite (NO₂⁻) (mg/L) (0 - 1)"
          name="pondNitrite"
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
            name="pondNitrite"
            type="number"
            placeholder="Enter nitrite (mg/L)"
            onChange={handleUpdateChange}
          />
        </Form.Item>

        <Form.Item
          label="Nitrate (NO₃⁻) (mg/L) (0 - 100)"
          name="pondNitrate"
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
            name="pondNitrate"
            type="number"
            placeholder="Enter nitrate (mg/L)"
            onChange={handleUpdateChange}
          />
        </Form.Item>

        <Form.Item
          label="Phosphate (mg/L) (0 - 2)"
          name="pondPhosphate"
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
            name="pondPhosphate"
            type="number"
            placeholder="Enter phosphate (mg/L)"
            onChange={handleUpdateChange}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" danger htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button
            onClick={() => {
              handleCancelUpdate();
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

export default UpdateWaterParameterProfile;
