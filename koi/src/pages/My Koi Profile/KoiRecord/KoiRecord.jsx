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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Fixed page size to 5

  const userType = localStorage.getItem("usertype");

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
        setKoiRecords((prevRecords) => {
          // Place the new record at the beginning
          const newRecords = [response.data.koiRecord, ...prevRecords];
          // Sort records after addition
          newRecords.sort(
            (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
          );
          return newRecords;
        });
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

  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = koiRecords.slice(startIndex, startIndex + pageSize);

  return (
    <div className="koi-record-container">
      <Title level={2} className="koi-record-title">
        Koi Records
      </Title>
      {userType === "Customer" && (
        <Button
          type="primary"
          onClick={showModal}
          className="add-record-button"
        >
          Add Koi Record
        </Button>
      )}

      <Table
        dataSource={paginatedData}
        columns={columns}
        rowKey="recordDate"
        pagination={{
          current: currentPage,
          pageSize: pageSize, // Fixed to 5
          total: koiRecords.length,
          onChange: (page) => {
            setCurrentPage(page);
          },
          showSizeChanger: false, // Disable page size changer
        }}
      />

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
            rules={[{ required: true, message: "Please input record date!" }]}
          >
            <Input type="text" readOnly />
          </Form.Item>
          <Form.Item
            label="Length (cm)"
            name="length"
            rules={[
              { required: true, message: "Please input length!" },
              {
                validator: (_, value) => {
                  const numValue = Number(value);
                  if (numValue >= 0 && numValue <= 126) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Length must be between 0 and 126 cm!")
                  );
                },
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Weight (kg)"
            name="weight"
            rules={[
              { required: true, message: "Please input weight!" },
              {
                validator: (_, value) => {
                  const numValue = Number(value);
                  if (numValue >= 0 && numValue <= 15) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Weight must be between 0 and 15 kg!")
                  );
                },
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Body Shape"
            name="bodyShape"
            rules={[{ required: true, message: "Please select body shape!" }]}
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
              { required: true, message: "Please input age!" },
              {
                validator: (_, value) => {
                  const numValue = Number(value);
                  if (numValue >= 1) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Age must be greater than 1 month!")
                  );
                },
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Record
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KoiRecord;
