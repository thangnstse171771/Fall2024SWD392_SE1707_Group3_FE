import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Table, message, Modal } from "antd";
import api from "../../../config/axios"; // Adjust the import as needed

const { Option } = Select;

const KoiTransfer = ({ koi, ponds }) => {
  const [form] = Form.useForm();
  const [transfers, setTransfers] = useState([]);
  const [currentPond, setCurrentPond] = useState(koi.currentPondId); // Thêm state mới
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (koi?.fishId) {
      fetchTransferHistory();
    }
  }, [koi]);

  const fetchTransferHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await api.get(`/api/koi/fishTransfers/${koi.fishId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // If there are no transfers, just show an empty array
        if (response.data.data && response.data.data.length > 0) {
          setTransfers(response.data.data);
        } else {
          setTransfers([]); // Set empty transfers when no data
        }
      } else {
        message.error("Failed to fetch transfer history.");
      }
    } catch (error) {
      console.error("Error fetching transfer history:", error);
      setTransfers([]); // Set empty transfers state if there's an error
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleTransfer = async (values) => {
    if (values.pondId === currentPond) {
      message.error("Cannot transfer to the same pond.");
      return;
    }
    const newPond = ponds.find((pond) => pond.pondId === values.pondId);

    Modal.confirm({
      title: "Confirm Transfer",
      content: `Are you sure you want to transfer ${koi.koiName} to pond ${
        newPond ? newPond.pondName : "N/A"
      }?`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await api.post(
            "/api/koi/transferKoi",
            {
              fishId: koi.fishId,
              newPondId: values.pondId,
              reason: values.reason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            message.success("Koi transferred successfully!");
            setCurrentPond(values.pondId); // Cập nhật ao hiện tại
            fetchTransferHistory();
            form.resetFields();
          } else {
            message.error(response.data.message || "Transfer failed.");
          }
        } catch (error) {
          message.error("Error transferring Koi.");
          console.error("Error transferring Koi:", error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const currentPondDetails = ponds.find((pond) => pond.pondId === currentPond);

  return (
    <div className="koi-transfer">
      <h3>Transfer Koi</h3>
      <p>
        <strong>Current Pond:</strong>{" "}
        {currentPondDetails ? currentPondDetails.pondName : "N/A"}
      </p>
      <Form form={form} onFinish={handleTransfer} layout="vertical">
        <Form.Item
          name="pondId"
          label="New Pond"
          rules={[{ required: true, message: "Please select a new pond!" }]}
        >
          <Select placeholder="Select a pond">
            {ponds
              .filter(
                (pond) =>
                  pond.status === "active" && // Ensure the pond is active
                  pond.pondCapacity.remainingSlots > 0 && // Ensure the pond has available slots
                  pond.pondId !== currentPond // Ensure the pond is not the current pond
              )
              .map((pond) => (
                <Option key={pond.pondId} value={pond.pondId}>
                  {pond.pondName} ({pond.pondCapacity.remainingSlots} slots
                  remaining)
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: "Please enter a reason" }]}
        >
          <Input placeholder="Enter reason for transfer" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Transfer Koi
          </Button>
        </Form.Item>
      </Form>

      <h3>Transfer History</h3>
      {transfers.length > 0 ? (
        <Table
          dataSource={transfers}
          columns={[
            {
              title: "Transfer ID",
              dataIndex: "transferId",
              key: "transferId",
            },
            {
              title: "Old Pond",
              dataIndex: ["OldPond", "pondName"],
              key: "oldPondName",
            },
            {
              title: "New Pond",
              dataIndex: ["NewPond", "pondName"],
              key: "newPondName",
            },
            { title: "Reason", dataIndex: "reason", key: "reason" },
            {
              title: "Date",
              dataIndex: "transferDate",
              key: "transferDate",
              render: (text) => new Date(text).toLocaleString(),
            },
          ]}
          rowKey="transferId"
          pagination={{ pageSize: 5 }}
          loading={loadingHistory}
        />
      ) : (
        <p>No transfer history available for this Koi.</p> // Friendly message when no history
      )}
    </div>
  );
};

export default KoiTransfer;
