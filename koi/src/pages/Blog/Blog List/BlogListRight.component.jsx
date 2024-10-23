import React from "react";

const BlogListRight = () => {
  return (
    <div>
      <div className="main-blog-list">
        <div className="main-blog-card">
          <img
            src="https://www.grandkoi.com/wp-content/uploads/2023/06/tips-to-build-a-koi-pond.jpg"
            alt="blog image"
            className="main-blog-image"
          />
          <div className="main-blog-content">
            <h1 className="main-blog-title">Title</h1>
            <h3 className="main-blog-description">Description</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogListRight;
