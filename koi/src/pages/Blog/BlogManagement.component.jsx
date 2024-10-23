import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Form, Input, message, Spin } from "antd";
import api from "../../config/axios";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await api.get("/api/blog/getAllBlogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setBlogs(response.data);
      }
    } catch (error) {
      message.error("Error fetching blog data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateBlog = async (values) => {
    const token = sessionStorage.getItem("token");
    try {
      if (editingBlog) {
        await api.put(`/api/blog/updateBlog/${editingBlog.blogId}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Blog updated successfully!");
      } else {
        await api.post("/api/blog/createBlog", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Blog created successfully!");
      }
      form.resetFields();
      setIsModalVisible(false);
      fetchBlogs();
    } catch (error) {
      message.error("Error saving blog data.");
    }
  };

  const confirmDeleteBlog = (blogId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blog?",
      content: "Once deleted, the blog cannot be recovered.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDeleteBlog(blogId),
    });
  };

  const handleDeleteBlog = async (blogId) => {
    const token = sessionStorage.getItem("token");
    try {
      await api.delete(`/api/blog/deleteBlog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      message.error("Error deleting blog.");
    }
  };

  const showModal = (blog = null) => {
    setEditingBlog(blog);
    if (blog) {
      form.setFieldsValue(blog);
    }
    setIsModalVisible(true);
  };

  const columns = [
    { title: "Blog ID", dataIndex: "blogId", key: "blogId" },
    { title: "Title", dataIndex: "blogTitle", key: "blogTitle" },
    { title: "Content", dataIndex: "blogContent", key: "blogContent" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="actions">
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => confirmDeleteBlog(record.blogId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="blog-card" title="Manage Blogs">
      <Button
        type="primary"
        className="add-blog-btn"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Blog
      </Button>

      {loading ? (
        <Spin tip="Loading blogs..." />
      ) : (
        <Table columns={columns} dataSource={blogs} rowKey="blogId" />
      )}

      <Modal
        title={editingBlog ? "Edit Blog" : "Create Blog"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateOrUpdateBlog}>
          <Form.Item
            name="blogTitle"
            label="Title"
            rules={[
              { required: true, message: "Please input the blog title!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="blogContent"
            label="Content"
            rules={[
              { required: true, message: "Please input the blog content!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingBlog ? "Update Blog" : "Create Blog"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BlogManagement;
