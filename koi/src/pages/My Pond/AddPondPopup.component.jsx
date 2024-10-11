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
          label="Pond Name"
          name="pondName"
          rules={[{ required: true, message: "Please input the pond name!" }]}
        >
          <Input
            value={pondData.pondName}
            onChange={handleInputChange}
            placeholder="Enter pond name"
          />
        </Form.Item>

        <Form.Item
          label="Pond Image URL"
          name="pondImage"
          rules={[
            { required: true, message: "Please input the pond image URL!" },
          ]}
        >
          <Input
            value={pondData.pondImage}
            onChange={handleInputChange}
            placeholder="Enter pond image URL"
          />
        </Form.Item>

        <Form.Item
          label="Pond Size"
          name="pondSize"
          rules={[{ required: true, message: "Please input the pond size!" }]}
        >
          <Input
            type="number"
            value={pondData.pondSize}
            onChange={handleInputChange}
            placeholder="Enter pond size"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Pond Depth"
          name="pondDepth"
          rules={[{ required: true, message: "Please input the pond depth!" }]}
        >
          <Input
            type="number"
            value={pondData.pondDepth}
            onChange={handleInputChange}
            placeholder="Enter pond depth"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Pond Volume"
          name="pondVolume"
          rules={[{ required: true, message: "Please input the pond volume!" }]}
        >
          <Input
            type="number"
            value={pondData.pondVolume}
            onChange={handleInputChange}
            placeholder="Enter pond volume"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Pond Drains"
          name="pondDrains"
          rules={[
            {
              required: true,
              message: "Please input the number of pond drains!",
            },
          ]}
        >
          <Input
            type="number"
            value={pondData.pondDrains}
            onChange={handleInputChange}
            placeholder="Enter pond drains"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Pond Aeration Capacity"
          name="pondAeroCapacity"
          rules={[
            {
              required: true,
              message: "Please input the pond aeration capacity!",
            },
          ]}
        >
          <Input
            type="number"
            value={pondData.pondAeroCapacity}
            onChange={handleInputChange}
            placeholder="Enter pond aeration capacity"
            min={0}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" danger htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button onClick={() => {
              form.resetFields(); // Reset form on cancel button click
              handleCancel();
            }} style={{ marginLeft: "8px" }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPondPopup;
