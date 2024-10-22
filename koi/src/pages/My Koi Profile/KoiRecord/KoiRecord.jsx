import React, { useEffect, useState } from "react";
import { Spin, Form, Input, Button, Modal, Typography, Table, Select } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const { Title } = Typography;
const { Option } = Select;

const KoiRecord = ({ koi }) => {
  const [koiRecords, setKoiRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAllKoiRecords = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await api.get("/api/koi/getAllKoiRecord", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data.success) {
          setKoiRecords(response.data.data || []);
        } else {
          toast.error("Failed to fetch koi records.");
        }
      } catch (error) {
        toast.error("Error fetching koi records.");
        console.error("Error fetching koi records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllKoiRecords();
  }, []);

  const handleSubmit = async (values) => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await api.post(
            "/api/koi/koi-record",
            {
                fishId: koi.fishId,
                recordDate: values.recordDate,
                length: values.length,
                weight: values.weight,
                bodyShape: values.bodyShape,
                age: values.age,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("API Response:", response.data);

        
        if (response.data.message === 'KoiRecord added successfully') {
            toast.success("Koi record added successfully!");
            setKoiRecords((prevRecords) => [...prevRecords, response.data.koiRecord]);
            form.resetFields();
            setIsModalVisible(false);
        } else {
            toast.error("Failed to add koi record.");
        }
    } catch (error) {
        toast.error("Error adding koi record.");
        console.error("Error adding koi record:", error);
    }
};



  const showModal = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    form.setFieldsValue({ recordDate: currentDate });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: "Record Date",
      dataIndex: "recordDate",
      key: "recordDate",
    },
    {
      title: "Length (cm)",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Weight (kg)",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Body Shape",
      dataIndex: "bodyShape",
      key: "bodyShape",
    },
    {
      title: "Age (months)",
      dataIndex: "age",
      key: "age",
    },
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <Title level={2}>Koi Records</Title>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
        Add Koi Record
      </Button>

      <Modal
        title="Add Koi Record"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Record Date"
            name="recordDate"
            rules={[{ required: true, message: "Record date is required!" }]}
          >
            <Input
              type="text"
              value={form.getFieldValue("recordDate")}
              readOnly
            />
          </Form.Item>

          <Form.Item
            label="Length (cm)"
            name="length"
            rules={[
              { required: true, message: "Please input the length!" },
              {
                validator: (_, value) => {
                  if (value < 25 || value > 126) {
                    return Promise.reject("Length must be between 25 and 126 cm!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>

          <Form.Item
            label="Weight (kg)"
            name="weight"
            rules={[
              { required: true, message: "Please input the weight!" },
              {
                validator: (_, value) => {
                  if (value < 0.2 || value > 15) {
                    return Promise.reject("Weight must be between 0.2 and 15 kg!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>

          <Form.Item
            label="Body Shape"
            name="bodyShape"
            rules={[
              { required: true, message: "Please select the body shape!" },
            ]}
          >
            <Select placeholder="Select body shape">
              <Option value="slim">Slim</Option>
              <Option value="normal">Normal</Option>
              <Option value="heavy">Heavy</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Age (months)"
            name="age"
            rules={[
              { required: true, message: "Please input the age!" },
              {
                validator: (_, value) => {
                  if (value < 1 || value > 24) {
                    return Promise.reject("Age must be between 1 and 24 months!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ overflow: "auto", marginTop: 20 }}>
        {koiRecords.length > 0 ? (
          <Table
            dataSource={koiRecords}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        ) : (
          <p>No koi records found.</p>
        )}
      </div>
    </div>
  );
};

export default KoiRecord;
