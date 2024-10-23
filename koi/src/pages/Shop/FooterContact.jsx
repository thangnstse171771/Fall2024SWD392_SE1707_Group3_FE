import React from "react";

export default function FooterContact() {
  return (
    <div style={footerStyle}>
      <h2 style={headingStyle}>Contact Koimine Company</h2>
      <p style={paragraphStyle}>For more details, feel free to reach out:</p>
      <p style={contactStyle}>
        <a href="mailto:TruongNNSE172542@fpt.edu.vn" style={linkStyle}>
          TruongNNSE172542@fpt.edu.vn
        </a>{" "}
        |{" "}
        <a href="tel:0327730336" style={linkStyle}>
          0327730336
        </a>
      </p>
    </div>
  );
}

const footerStyle = {
  padding: "40px 20px",
  backgroundColor: "#f1f1f1",
  textAlign: "center",
  borderTop: "2px solid #ddd",
};

const headingStyle = {
  marginBottom: "10px",
  fontSize: "24px",
  color: "#333",
};

const paragraphStyle = {
  marginBottom: "20px",
  fontSize: "16px",
  color: "#666",
};

const contactStyle = {
  fontSize: "18px",
  color: "#333",
};

const linkStyle = {
  textDecoration: "none",
  color: "red", // Màu cho link
  fontWeight: "bold",
};

linkStyle.hover = {
  textDecoration: "underline", // Gạch chân khi hover
};
