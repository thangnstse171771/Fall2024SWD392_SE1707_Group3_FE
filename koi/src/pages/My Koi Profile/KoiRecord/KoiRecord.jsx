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
  Empty,
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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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
          const newRecords = [response.data.koiRecord, ...prevRecords];

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

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const validateWeightAndLength = (age) => {
    if (age <= 12) {
      return {
        weight: { min: 0.08, max: 0.15 },
        length: { min: 0, max: 20 },
      };
    } else if (age >= 13 && age <= 24) {
      return {
        weight: { min: 0.2, max: 0.3 },
        length: { min: 25, max: 35 },
      };
    } else if (age >= 25) {
      return {
        weight: { min: 1, max: 15 },
        length: { min: 35, max: 126 },
      };
    }
    return { weight: { min: 0, max: 0 }, length: { min: 0, max: 0 } };
  };

  const columns = [
    {
      title: "Record Date",
      dataIndex: "recordDate",
      key: "recordDate",
      render: (text) => formatDate(text),
    },
    { title: "Length (cm)", dataIndex: "length", key: "length" },
    { title: "Weight (kg)", dataIndex: "weight", key: "weight" },
    { title: "Body Shape", dataIndex: "bodyShape", key: "bodyShape" },
    { title: "Age (months)", dataIndex: "age", key: "age" },
    {
      title: "Calculated Weight (kg)",
      dataIndex: "calculateWeight",
      key: "calculateWeight",
    },
    {
      title: "Food Requirement (kg)",
      dataIndex: "foodRequire",
      key: "foodRequire",
    },
  ];

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

      {koiRecords.length === 0 ? (
        <Empty description="No koi records found for this fish" />
      ) : (
        <Table
          dataSource={paginatedData}
          columns={columns}
          rowKey="recordDate"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: koiRecords.length,
            onChange: (page) => {
              setCurrentPage(page);
            },
            showSizeChanger: false,
          }}
        />
      )}

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
            label="Age (months)"
            name="age"
            rules={[{ required: true, message: "Please input age!" }]}
            onChange={(e) => {
              const { value } = e.target;
              const { weight, length } = validateWeightAndLength(Number(value));
              form.setFieldsValue({
                weight: weight ? form.getFieldValue("weight") : undefined,
                length: length ? form.getFieldValue("length") : undefined,
              });
            }}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Length (cm)"
            name="length"
            rules={[
              { required: true, message: "Please input length!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const age = getFieldValue("age");
                  const { length } = validateWeightAndLength(age);
                  if (value >= length.min && value <= length.max) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      `Length must be between ${length.min} and ${length.max} cm!`
                    )
                  );
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Weight (kg)"
            name="weight"
            rules={[
              { required: true, message: "Please input weight!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const age = getFieldValue("age");
                  const { weight } = validateWeightAndLength(age);
                  if (value >= weight.min && value <= weight.max) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      `Weight must be between ${weight.min} and ${weight.max} kg!`
                    )
                  );
                },
              }),
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
