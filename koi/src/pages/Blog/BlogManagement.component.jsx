import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Alert,
} from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import api from "../../config/axios";
import { CircularProgress } from "@mui/material";
import "./BlogManagement.scss"; // Create a separate SCSS file for styling

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

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

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    setImageUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          setFormData({ ...formData, image: downloadURL });
        });
      }
    );
  };

  const handleCreateOrUpdateBlog = async (values) => {
    const token = sessionStorage.getItem("token");
    const payload = {
      blogTitle: values.blogTitle.trim(),
      blogContent: values.blogContent.trim(),
      image: formData.image || values.image.trim(),
    };

    try {
      if (editingBlog) {
        await api.put(`/api/blog/updateBlog/${editingBlog.blogId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Blog updated successfully!");
      } else {
        await api.post("/api/blog/createBlog", payload, {
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
      form.setFieldsValue({
        blogTitle: blog.blogTitle,
        blogContent: blog.blogContent,
        imageUrl: blog.image,
      });
      setFormData({ image: blog.image });
    }
    setIsModalVisible(true);
  };

  const columns = [
    { title: "Blog ID", dataIndex: "blogId", key: "blogId" },
    { title: "Title", dataIndex: "blogTitle", key: "blogTitle" },
    { title: "Content", dataIndex: "blogContent", key: "blogContent" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="Blog"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        />
      ),
    },
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
        style={{
          marginBottom: 16,
          backgroundColor: "#4CAF50",
          borderRadius: "5px",
        }}
      >
        Add Blog
      </Button>

      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="blogId"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      />

      <Modal
        title={editingBlog ? "Edit Blog" : "Add Blog"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        style={{ borderRadius: "8px" }}
      >
        <Form form={form} onFinish={handleCreateOrUpdateBlog}>
          <Form.Item
            name="blogTitle"
            label="Title"
            rules={[{ required: true, message: "Title is required!" }]}
          >
            <Input placeholder="Enter blog title" />
          </Form.Item>

          <Form.Item
            name="blogContent"
            label="Content"
            rules={[{ required: true, message: "Content is required!" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter blog content" />
          </Form.Item>

          {/* Image Upload Section */}
          <div className="upload-container">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setFormData({ ...formData, image: null });
              }}
              className="upload-input"
            />
            <Button
              type="button"
              onClick={handleUploadImage}
              disabled={imageUploadProgress}
              className="upload-btn"
            >
              {imageUploadProgress ? (
                <CircularProgress
                  variant="determinate"
                  value={imageUploadProgress}
                />
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>

          {imageUploadError && (
            <Alert message={imageUploadError} type="error" showIcon />
          )}

          {formData.image && (
            <div className="image-preview">
              <img
                src={formData.image}
                alt="Blog"
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            </div>
          )}

          <Form.Item className="form-footer">
            <Button type="primary" htmlType="submit" className="submit-btn">
              {editingBlog ? "Update Blog" : "Add Blog"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BlogManagement;
