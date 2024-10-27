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
  
  const calculatePondSize = (length, width) => {
    return length * width || 0;
  };

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
        noValidate
        onValuesChange={(changedValues, allValues) => {
          const { pondLength, pondWidth } = allValues;
          const pondSize = calculatePondSize(pondLength, pondWidth);
          form.setFieldsValue({ pondSize });
        }}
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
          label="Pond Length (m)"
          name="pondLength"
          rules={[{ required: true, message: "Please input the pond length!" }]}
        >
          <Input
            type="number"
            placeholder="Enter pond length"
          />
        </Form.Item>

        <Form.Item
          label="Pond Width (m)"
          name="pondWidth"
          rules={[{ required: true, message: "Please input the pond width!" }]}
        >
          <Input
            type="number"
            placeholder="Enter pond width"
          />
        </Form.Item>

        <Form.Item
          label="Pond Size (m²) (3 - 33m²)"
          name="pondSize"
          rules={[
            { required: true, message: "Please input the pond size!" },
            {
              validator: (_, value) => {
                if (value < 3) {
                  return Promise.reject(
                    new Error("Pond size must be at least 3 m²!")
                  );
                }
                if (value > 33) {
                  return Promise.reject(
                    new Error("Pond size cannot exceed 33 m²!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            readOnly
            placeholder="Calculated pond size"
          />
        </Form.Item>

        <Form.Item
          label="Pond Depth (m)"
          name="pondDepth"
          rules={[
            { required: true, message: "Please input the pond depth!" },
            {
              validator: (_, value) => {
                if (value > 3) {
                  return Promise.reject(
                    new Error("Pond depth cannot exceed 3 meters!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            value={pondData.pondDepth}
            onChange={handleInputChange}
            placeholder="Enter pond depth"
          />
        </Form.Item>

        <Form.Item
          label="Pond Volume (m³) ( >= 1.3 m³ )"
          name="pondVolume"
          rules={[
            { required: true, message: "Please input the pond volume!" },
            {
              validator: (_, value) => {
                const pondSize = form.getFieldValue('pondSize');
                const pondDepth = form.getFieldValue('pondDepth');
                const multiply = pondSize * pondDepth;

                if (value < 1.3) {
                  return Promise.reject(
                    new Error("Pond volume must be at least 1.3 m³!")
                  );
                }
                if (value > multiply + 1) {
                  return Promise.reject(
                    new Error(`Volume cant exceed ${multiply + 1} m³!`)
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            value={pondData.pondVolume}
            onChange={handleInputChange}
            placeholder="Enter pond volume"
          />
        </Form.Item>

        <Form.Item
          label="Pond Drains (1 - 2)"
          name="pondDrains"
          rules={[
            {
              required: true,
              message: "Please input the number of pond drains!",
            },
            {
              validator: (_, value) => {
                if (value < 1) {
                  return Promise.reject(
                    new Error("There must be at least 1 pond drain!")
                  );
                }
                if (value > 2) {
                  return Promise.reject(
                    new Error("There can't be more than 2 pond drains!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            value={pondData.pondDrains}
            onChange={handleInputChange}
            placeholder="Enter pond drains"
          />
        </Form.Item>

        <Form.Item
          label="Pond Aeration Capacity (m³/hour) (Volume * 1.5 or * 2)"
          name="pondAeroCapacity"
          rules={[
            {
              required: true,
              message: "Please input the pond aeration capacity!",
            },
            {
              validator: (_, value) => {
                const pondVolume = form.getFieldValue('pondVolume');

                if (value < pondVolume * 1.5 || value > pondVolume * 2) {
                  return Promise.reject(
                    new Error(
                      "Pond aeration capacity must be between 1.5 or 2 times the volume!"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            value={pondData.pondAeroCapacity}
            onChange={handleInputChange}
            placeholder="Enter pond aeration capacity"
          />
        </Form.Item>

        <Form.Item
          label="Pond Capacity of Koi Fish ( <= Volume ) "
          name="pondCapacityOfKoiFish"
          rules={[
            {
              required: true,
              message: "Please input the pond capacity of koi fish!",
            },
            {
              validator: async (_, value) => {
                const pondVolume = form.getFieldValue("pondVolume");
        
                // Ensure we parse the values to numbers for proper comparison
                const parsedValue = parseFloat(value);
                const parsedVolume = parseFloat(pondVolume);
        
                if (isNaN(parsedValue) || isNaN(parsedVolume)) {
                  return Promise.reject(new Error("Invalid input values."));
                }
        
                if (parsedValue > parsedVolume) {
                  return Promise.reject(
                    new Error("Fish capacity can't exceed pond volume!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            value={pondData.pondCapacityOfKoiFish}
            onChange={handleInputChange}
            placeholder="Enter pond aeration capacity"
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

export default AddPondPopup;
