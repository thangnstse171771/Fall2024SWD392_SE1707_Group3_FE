import { Modal, Input, Button, Form, Select } from "antd";

const { Option } = Select;

const AddFishInProfile = ({
  open,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add New Fish"
      open={open}
      onCancel={onCancel}
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
