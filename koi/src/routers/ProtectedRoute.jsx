import { Navigate } from "react-router-dom";

// Component kiểm tra quyền truy cập dựa trên vai trò người dùng
const ProtectedRoute = ({ allowedRoles, children }) => {
  const userType = localStorage.getItem("usertype");

  // Nếu người dùng không có vai trò phù hợp, điều hướng về trang chủ hoặc trang login
  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/" />;
  }

  // Nếu có quyền, render nội dung con
  return children;
};

export default ProtectedRoute;
