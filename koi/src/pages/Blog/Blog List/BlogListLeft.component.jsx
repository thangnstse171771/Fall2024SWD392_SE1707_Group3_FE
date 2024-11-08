import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { Link } from "react-router-dom";

const BlogListLeft = () => {
  const [featuredBlog, setFeaturedBlog] = useState({});
  const [blogs, setBlogs] = useState([]);

  const fetchFeaturedBlog = async () => {
    try {
      const response = await api.get(`/api/blog/getBlogById/2`);
      if (response.data.blogStatus === "active") {
        setFeaturedBlog(response.data);
      } else {
        setFeaturedBlog(null);
      }
    } catch (error) {
      toast.error("Error fetching featured blog!");
      console.error("Error fetching featured blog:", error);
    }
  };

  const fetchAllBlogs = async () => {
    try {
      const response = await api.get(`/api/blog/getAllBlogs`);
      const activeBlogs = response.data.filter(blog => blog.blogStatus === "active");
      setBlogs(activeBlogs);
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
      {featuredBlog && (
        <div className="featured-card">
          <h3 className="featured-text">FEATURED</h3>
          <div className="featured-image">
            <img src={featuredBlog.image} alt="Featured" />
            <div className="featured-overlay">
              <Link to={`/blog/${featuredBlog.blogId}`} className="featured-title">
                <h4>{featuredBlog.blogTitle}</h4>
              </Link>
              <h4 className="featured-desc">
                {featuredBlog.blogContent
                  ? `${featuredBlog.blogContent.slice(0, 70)}...`
                  : ""}
              </h4>
            </div>
          </div>
        </div>
      )}

      <div className="small-blog-list">
        {blogs.slice(0, 3).map((blog) => (
          <div key={blog.blogId} className="small-blog-card">
            <Link
              to={`/blog/${blog.blogId}`}
              className="small-blog-image-container"
            >
              <img
                src={blog.image}
                alt="blog image"
                className="small-blog-image"
              />
            </Link>

            <div className="small-blog-content">
              <Link to={`/blog/${blog.blogId}`} className="small-blog-title">
                <h4>{blog.blogTitle}</h4>
              </Link>
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
