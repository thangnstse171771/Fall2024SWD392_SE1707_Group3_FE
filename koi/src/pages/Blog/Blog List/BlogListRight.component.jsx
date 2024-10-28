import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";

const BlogListRight = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchAllBlogs = async () => {
    try {
      const response = await api.get(`/api/blog/getAllBlogs`);
      setBlogs(response.data);
    } catch (error) {
      toast.error("Error fetching blogs!");
      console.error("Error fetching featured blog:", error);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div>
      <div className="main-blog-list">
        {blogs.map((blog) => (
          <div key={blog.blogId} className="main-blog-card">
            <img
              src={blog.image}
              alt="blog image"
              className="main-blog-image"
              onClick={() => handleBlogClick(blog.blogId)}
            />
            <div className="main-blog-content">
              <h1
                className="main-blog-title"
                onClick={() => handleBlogClick(blog.blogId)}
              >
                {blog.blogTitle}
              </h1>
              <h3 className="main-blog-description">{blog.blogContent.slice(0, 300)}...</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogListRight;
