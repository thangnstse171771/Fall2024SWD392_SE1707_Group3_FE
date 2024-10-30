import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

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
            <Link
              to={`/blog/${blog.blogId}`}
              className="main-blog-img-container"
            >
              <img
                src={blog.image}
                alt="blog image"
                className="main-blog-image"
              />
            </Link>

            <div className="main-blog-content">
              <Link to={`/blog/${blog.blogId}`} className="main-blog-title">
                <h1>{blog.blogTitle}</h1>
              </Link>
              <h3 className="main-blog-description">
                {blog.blogContent.slice(0, 300)}...
              </h3>
              <div className="main-blog-author-container">
                <h3 className="main-blog-author-extra">by</h3>
                <h3 className="main-blog-author">
                   {blog.User?.username || "Unknown Author"}
                </h3>
                <h3 className="main-blog-author-extra">- {new Date(blog.blogDate).toLocaleDateString()}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogListRight;
