import React from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";

const AddPondPopup = ({ open, onSubmit, handleCancel }) => {
  const onFinish = (values) => {
    onSubmit(values);
    console.log(values);
  };

  return (
    <Modal
      title="Add New Pond"
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Pond Name"
          name="pondName"
          rules={[{ required: true, message: "Please input the pond name!" }]}
        >
          <Input placeholder="Enter pond name" />
        </Form.Item>

        <Form.Item
          label="Pond Image URL"
          name="pondImage"
          rules={[
            { required: true, message: "Please input the pond image URL!" },
          ]}
        >
          <Input placeholder="Enter pond image URL" />
        </Form.Item>

        <Form.Item
          label="Pond Size"
          name="pondSize"
          rules={[{ required: true, message: "Please input the pond size!" }]}
        >
          <Input placeholder="Enter pond size" />
        </Form.Item>

        <Form.Item
          label="Pond Depth"
          name="pondDepth"
          rules={[{ required: true, message: "Please input the pond depth!" }]}
        >
          <Input placeholder="Enter pond depth" />
        </Form.Item>

        <Form.Item
          label="Pond Volume"
          name="pondVolume"
          rules={[{ required: true, message: "Please input the pond volume!" }]}
        >
          <Input placeholder="Enter pond volume" />
        </Form.Item>

        <Form.Item
          label="Pond Number"
          name="pondNumber"
          rules={[{ required: true, message: "Please input the pond number!" }]}
        >
          <InputNumber
            min={1}
            placeholder="Enter pond number"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Pond Capacity"
          name="pondCapacity"
          rules={[
            { required: true, message: "Please input the pond capacity!" },
          ]}
        >
          <Input placeholder="Enter pond capacity" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" danger htmlType="submit">
            Submit
          </Button>
          <Button danger onClick={handleCancel} style={{ marginLeft: "8px" }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPondPopup;
