import React from "react";

const BlogListLeft = () => {
  return (
    <div>
      <div className="featured-card">
        <h3 className="featured-title">FEATURED</h3>
        <div className="featured-image">
          <img
            src="https://www.thespruce.com/thmb/Sx7GCSg2FZ_-j3YKxa97EsypXGI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/KoiPond-5fe8b3a605ef4743a55dba059cfb531b.jpg" // Replace with your actual image URL
            alt="Featured"
          />
          <div className="featured-overlay">
            <h4 className="featured-title">Bridge of Progress</h4>
            <h4 className="featured-desc">Description</h4>
          </div>
        </div>
      </div>

      <div className="small-blog-list">
        <div className="small-blog-card">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-oBPjDYorVZTRXD0AcVk-fLx6t2BR_loNQ&s"
            alt="blog image"
            className="small-blog-image"
          />
          <div className="small-blog-content">
            <h4 className="small-blog-title">Title</h4>
            <h5 className="small-blog-description">Description</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogListLeft;
