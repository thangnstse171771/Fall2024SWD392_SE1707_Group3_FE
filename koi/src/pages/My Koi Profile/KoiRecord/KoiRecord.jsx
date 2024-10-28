import React, { useEffect, useState } from "react";
import {
  Spin,
  Form,
  Input,
  Button,
  Modal,
  Typography,
  Table,
  Select,
} from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import "./KoiRecord.scss";

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
          const filteredRecords = response.data.data.filter(
            (record) => record.fishId === koi.fishId
          );
          setKoiRecords(filteredRecords || []);
        } else {
          toast.error("Failed to fetch koi records.");
        }
      } catch (error) {
        toast.error("Error fetching koi records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllKoiRecords();
  }, [koi.fishId]);

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

      if (response.data.message === "KoiRecord added successfully") {
        toast.success("Koi record added successfully!");
        setKoiRecords((prevRecords) => [
          ...prevRecords,
          response.data.koiRecord,
        ]);
        form.resetFields();
        setIsModalVisible(false);
      } else {
        toast.error("Failed to add koi record.");
      }
    } catch (error) {
      toast.error("Error adding koi record.");
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
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    { title: "Record Date", dataIndex: "recordDate", key: "recordDate" },
    { title: "Length (cm)", dataIndex: "length", key: "length" },
    { title: "Weight (kg)", dataIndex: "weight", key: "weight" },
    { title: "Body Shape", dataIndex: "bodyShape", key: "bodyShape" },
    { title: "Age (months)", dataIndex: "age", key: "age" },
  ];

  return (
    <div className="koi-record-container">
      <Title level={2} className="koi-record-title">
        Koi Records
      </Title>
      <Button type="primary" onClick={showModal} className="add-record-button">
        Add Koi Record
      </Button>

      <Modal
        title="Add Koi Record"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="add-record-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Record Date"
            name="recordDate"
            rules={[{ required: true }]}
          >
            <Input type="text" readOnly />
          </Form.Item>
          <Form.Item
            label="Length (cm)"
            name="length"
            rules={[{ required: true }]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>
          <Form.Item
            label="Weight (kg)"
            name="weight"
            rules={[{ required: true }]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>
          <Form.Item
            label="Body Shape"
            name="bodyShape"
            rules={[{ required: true }]}
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
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-btn">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className="record-table-container">
        {koiRecords.length > 0 ? (
          <Table
            dataSource={koiRecords}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <p className="no-records-message">No koi records found.</p>
        )}
      </div>
    </div>
  );
};

export default KoiRecord;
