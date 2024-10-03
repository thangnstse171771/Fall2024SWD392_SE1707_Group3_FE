import React from "react";
import { Modal, Form, Input, Button } from "antd";

const AddPondPopup = ({
  open,
  onSubmit,
  handleCancel,
  pondData,
  handleInputChange,
  loading,
}) => {
  return (
    <Modal
      title="Add New Pond"
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={onSubmit} layout="vertical">
        <Form.Item
          label="Pond Name"
          rules={[{ required: true, message: "Please input the pond name!" }]}
        >
          <Input
            name="pondName"
            value={pondData.pondName}
            onChange={handleInputChange}
            placeholder="Enter pond name"
          />
        </Form.Item>

        <Form.Item
          label="Pond Image URL"
          rules={[
            { required: true, message: "Please input the pond image URL!" },
          ]}
        >
          <Input
            name="pondImage"
            value={pondData.pondImage}
            onChange={handleInputChange}
            placeholder="Enter pond image URL"
          />
        </Form.Item>

        <Form.Item
          label="Pond Size"
          rules={[{ required: true, message: "Please input the pond size!" }]}
        >
          <Input
            min={0}
            type="number"
            name="pondSize"
            value={pondData.pondSize}
            onChange={handleInputChange}
            placeholder="Enter pond size"
          />
        </Form.Item>

        <Form.Item
          label="Pond Depth"
          rules={[{ required: true, message: "Please input the pond depth!" }]}
        >
          <Input
            min={0}
            type="number"
            name="pondDepth"
            value={pondData.pondDepth}
            onChange={handleInputChange}
            placeholder="Enter pond depth"
          />
        </Form.Item>

        <Form.Item
          label="Pond Volume"
          rules={[{ required: true, message: "Please input the pond volume!" }]}
        >
          <Input
            min={0}
            type="number"
            name="pondVolume"
            value={pondData.pondVolume}
            onChange={handleInputChange}
            placeholder="Enter pond volume"
          />
        </Form.Item>

        <Form.Item
          label="Pond Drains"
          rules={[{ required: true, message: "Please input the pond drains!" }]}
        >
          <Input
            min={0}
            type="number"
            name="pondDrains"
            value={pondData.pondDrains}
            onChange={handleInputChange}
            placeholder="Enter pond drains"
          />
        </Form.Item>

        <Form.Item
          label="Pond Aeration Capacity"
          rules={[
            {
              required: true,
              message: "Please input the pond aeration capacity!",
            },
          ]}
        >
          <Input
            type="number"
            name="pondAeroCapacity"
            value={pondData.pondAeroCapacity}
            onChange={handleInputChange}
            placeholder="Enter pond aeration capacity"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" danger htmlType="submit" loading={loading}>
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
