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
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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
    if (values.endDate.isBefore(values.healthDate)) {
      message.error("End date must be after health date!");
      return;
    }

    const token = sessionStorage.getItem("token");
    const formattedValues = {
      ...values,
      healthDate: values.healthDate.format("YYYY-MM-DD"),
      endDate: values.endDate.format("YYYY-MM-DD"),
      fishId: koi.fishId,
    };
    try {
      const response = await api.post(
        "/api/koi/addKoiHealth",
        formattedValues,
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
        setIsAddModalVisible(false);
        addForm.resetFields(); // Reset form after adding
      } else {
        message.error("Failed to add Koi health record.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const handleEditHealth = async (values) => {
    if (values.endDate.isBefore(values.healthDate)) {
      message.error("End date must be after health date!");
      return;
    }

    const token = sessionStorage.getItem("token");

    const formattedValues = {
      illness: values.illness,
      medicine: values.medicine,
      price: values.price,
      healthDate: editingRecord.healthDate,
      endDate: values.endDate.format("YYYY-MM-DD"), // Ensure endDate is formatted
    };

    try {
      const response = await api.put(
        `/api/koi/updateKoiHealth/${editingRecord.healthId}`,
        formattedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success("Koi health record updated successfully!");
        setHealthData((prevData) =>
          prevData.map((record) =>
            record.healthId === editingRecord.healthId
              ? { ...record, ...formattedValues }
              : record
          )
        );
        setIsEditModalVisible(false);
        editForm.resetFields(); // Reset form after editing
        setEditingRecord(null);
      } else {
        message.error("Failed to update Koi health record.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Koi health record?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDeleteHealth(record),
    });
  };

  const handleDeleteHealth = async (record) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.delete(
        `/api/koi/deleteKoiHealth/${record.healthId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success("Koi health record deleted successfully!");
        setHealthData((prevData) =>
          prevData.filter((item) => item.healthId !== record.healthId)
        );
      } else {
        message.error("Failed to delete Koi health record.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const paginatedData = healthData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalRecords = healthData.length;

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
        onClick={() => setIsAddModalVisible(true)}
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
              render: (text) => moment(text).format("YYYY-MM-DD"),
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
              render: (text) => moment(text).format("YYYY-MM-DD"),
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
            {
              title: "Actions",
              key: "actions",
              render: (text, record) => (
                <div>
                  <Button
                    type="link"
                    onClick={() => {
                      setEditingRecord(record);
                      editForm.setFieldsValue({
                        illness: record.illness,
                        medicine: record.medicine,
                        price: record.price,
                        healthDate: moment(record.healthDate),
                        endDate: moment(record.endDate),
                      });
                      setIsEditModalVisible(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="link"
                    danger
                    onClick={() => showDeleteConfirm(record)}
                  >
                    Delete
                  </Button>
                </div>
              ),
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
        visible={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields(); // Reset form when closed
        }}
        footer={null}
        className="add-health-modal"
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddHealth}>
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
            rules={[{ required: true, message: "Please enter illness!" }]}
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
            rules={[{ required: true, message: "Please enter medicine!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price ($)"
            rules={[{ required: true, message: "Please enter price!" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Add Record
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Koi Health Record"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields(); // Reset form when closed
        }}
        footer={null}
        className="edit-health-modal"
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditHealth}>
          <Form.Item
            name="healthDate"
            label="Health Date"
            rules={[{ required: true, message: "Please select health date!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabled
              value={moment(editingRecord?.healthDate)} // Set the initial value
            />
          </Form.Item>
          <Form.Item
            name="illness"
            label="Illness"
            rules={[{ required: true, message: "Please enter illness!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabled
              value={moment(editingRecord?.endDate)} // Set the initial value
            />
          </Form.Item>
          <Form.Item
            name="medicine"
            label="Medicine"
            rules={[{ required: true, message: "Please enter medicine!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price ($)"
            rules={[{ required: true, message: "Please enter price!" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Update Record
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KoiHealth;
