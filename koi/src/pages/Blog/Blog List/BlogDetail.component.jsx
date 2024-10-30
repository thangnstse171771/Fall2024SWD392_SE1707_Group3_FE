import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import BlogListLeft from "./BlogListLeft.component";
import "./BlogDetail.scss";
import { useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blogDetail, setBlogDetail] = useState({});

  const fetchBlogDetail = async () => {
    try {
      const response = await api.get(`/api/blog/getBlogById/${id}`);
      setBlogDetail(response.data);
    } catch (error) {
      toast.error("Error fetching blog!");
      console.error("Error fetching featured blog:", error);
    }
  };

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  return (
    <div className="blog-list-page">
      <div className="blog-list-container">
        <div className="blog-list-container-left">
          <BlogListLeft />
        </div>
        <div className="blog-detail-container-right">
          <div className="blog-detail-header">
            <h1>{blogDetail.blogTitle}</h1>
            <div className="author-date-style">
              <p>by</p>
              <p>{blogDetail.User?.username || "Unknown Author"}</p>
              <p>-</p>
              <p>{new Date(blogDetail.blogDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="blog-detail-image-container">
            <img
              className="blog-detail-image"
              src="https://www.thespruce.com/thmb/Sx7GCSg2FZ_-j3YKxa97EsypXGI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/KoiPond-5fe8b3a605ef4743a55dba059cfb531b.jpg"
              alt="blog detail"
            />
          </div>
          <div className="blog-detail-body">
            <p>
              {blogDetail.blogContent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
