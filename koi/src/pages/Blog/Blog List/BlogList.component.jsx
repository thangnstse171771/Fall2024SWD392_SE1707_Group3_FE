import React from "react";
import "./BlogList.scss";
import BlogListLeft from "./BlogListLeft.component";
import BlogListRight from "./BlogListRight.component";

const BlogList = () => {
  return (
    <div className="blog-list-page">
      <div className="blog-list-container">
        <div className="blog-list-container-left">
          <BlogListLeft />
        </div>
        <div className="blog-list-container-right">
          <BlogListRight />
        </div>
      </div>
    </div>
  );
};

export default BlogList;
