import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Typography,
} from "antd";
import api from "../../../config/axios";
import "./KoiHealth.scss";
import moment from "moment";

const { Title } = Typography;

const KoiHealth = ({ koi }) => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of records per page

  useEffect(() => {
    const fetchKoiHealth = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await api.get(`/api/koi/health/${koi.fishId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });

        if (response.data.success) {
          setHealthData(response.data.data || []);
        } else {
          message.error("Failed to fetch Koi health data.");
        }
      } catch (error) {
        message.error(
          error.response?.data?.message || "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKoiHealth();
  }, [koi.fishId]);

  const handleAddHealth = async (values) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.post(
        "/api/koi/addKoiHealth",
        { ...values, fishId: koi.fishId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success("Koi health record added successfully!");
        setHealthData((prevData) => [response.data.data, ...prevData]);
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error("Failed to add Koi health record.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  // Calculate current data for pagination
  const paginatedData = healthData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalRecords = healthData.length;

  // Function to disable past dates
  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  return (
    <Card className="koi-health-card">
      <Title level={2} className="koi-health-title">
        Koi Health Records
      </Title>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        className="add-health-button"
      >
        Add Koi Health Record
      </Button>
      {loading ? (
        <Spin tip="Loading health data..." />
      ) : (
        <Table
          dataSource={paginatedData}
          columns={[
            {
              title: "Health ID",
              dataIndex: "healthId",
              key: "healthId",
            },
            {
              title: "Health Date",
              dataIndex: "healthDate",
              key: "healthDate",
            },
            {
              title: "Illness",
              dataIndex: "illness",
              key: "illness",
            },
            {
              title: "End Date",
              dataIndex: "endDate",
              key: "endDate",
            },
            {
              title: "Medicine",
              dataIndex: "medicine",
              key: "medicine",
            },
            {
              title: "Price ($)",
              dataIndex: "price",
              key: "price",
              render: (text) => `$${text}`,
            },
            {
              title: "Koi Name",
              dataIndex: ["KoiFish", "koiName"],
              key: "koiName",
            },
          ]}
          rowKey="healthId"
          pagination={{
            current: currentPage,
            pageSize,
            total: totalRecords,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      )}

      <Modal
        title="Add Koi Health Record"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="add-health-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleAddHealth}>
          <Form.Item
            name="healthDate"
            label="Health Date"
            rules={[{ required: true, message: "Please select health date!" }]}
          >
            <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item
            name="illness"
            label="Illness"
            rules={[{ required: true, message: "Please input illness!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date!" }]}
          >
            <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item
            name="medicine"
            label="Medicine"
            rules={[{ required: true, message: "Please input medicine!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price!" }]}
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
    </Card>
  );
};

export default KoiHealth;
