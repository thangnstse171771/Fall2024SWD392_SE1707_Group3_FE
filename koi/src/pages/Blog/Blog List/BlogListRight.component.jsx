import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const BlogListRight = () => {
  const [blogs, setBlogs] = useState([]);
  
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

  return (
    <div>
      <div className="main-blog-list">
        {blogs.map((blog) => (
          <div key={blog.blogId} className="main-blog-card">
            <img
              src="https://www.grandkoi.com/wp-content/uploads/2023/06/tips-to-build-a-koi-pond.jpg"
              alt="blog image"
              className="main-blog-image"
            />
            <div className="main-blog-content">
              <h1 className="main-blog-title">{blog.blogTitle}</h1>
              <h3 className="main-blog-description">{blog.blogContent}</h3>
              {/* <h5 className="small-blog-description">{blog.blogContent.slice(0, 50)}...</h5> Show the first 50 characters */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogListRight;
