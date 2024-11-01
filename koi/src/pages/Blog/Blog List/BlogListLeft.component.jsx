import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const BlogListLeft = () => {
  const [featuredBlog, setFeaturedBlog] = useState({});
  const [blogs, setBlogs] = useState([]);

  const fetchFeaturedBlog = async () => {
    try {
      const response = await api.get(`/api/blog/getBlogById/2`);
      setFeaturedBlog(response.data);
    } catch (error) {
      toast.error("Error fetching featured blog!");
      console.error("Error fetching featured blog:", error);
    }
  };

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
    fetchFeaturedBlog();
    fetchAllBlogs();
  }, []);

  return (
    <div>
      <div className="featured-card">
        <h3 className="featured-title">FEATURED</h3>
        <div className="featured-image">
          <img
            src={featuredBlog.image}
            alt="Featured"
          />
          <div className="featured-overlay">
            <h4 className="featured-title">{featuredBlog.blogTitle}</h4>
            <h4 className="featured-desc">{featuredBlog.blogContent ? `${featuredBlog.blogContent.slice(0, 70)}...` : ""}</h4>
          </div>
        </div>
      </div>

      <div className="small-blog-list">
        {blogs.slice(0, 3).map((blog) => (
          <div key={blog.blogId} className="small-blog-card">
            <img
              src={blog.image}
              alt="blog image"
              className="small-blog-image"
            />
            <div className="small-blog-content">
              <h4 className="small-blog-title">{blog.blogTitle}</h4>
              <h5 className="small-blog-description">
                {blog.blogContent.slice(0, 50)}...
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogListLeft;
