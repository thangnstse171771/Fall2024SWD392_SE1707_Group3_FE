import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, Dropdown, Button } from "antd";
import { UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import fishImage from "../../assets/fish-image.png";
import "./Header.scss";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(""); // State để lưu vai trò người dùng

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("usertype");
    setIsLoggedIn(!!token);
    setUserType(storedUserType); // Lấy userType từ localStorage và lưu vào state
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usertype"); // Xóa userType khi đăng xuất
    setIsLoggedIn(false);
    navigate("/login");
  };

  const menu = (
    <Menu>
      {isLoggedIn ? (
        <>
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="3" icon={<LoginOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Fish Care</h2>
      </div>
      <div className="navbar-links">
        <Link to="/">HOME</Link>
        <Link to="/manage-koi">MANAGE KOI</Link>

        {/* Kiểm tra nếu userType không phải là 'Customer', thì hiển thị Manage Customer */}
        {(userType === "Admin" ||
          userType === "Manager" ||
          userType === "Staff") && (
          <Link to="/CustomerList">MANAGE CUSTOMER</Link>
        )}
        {userType === "Staff" && (
          <Link to="/blogmanagement">BLOG MANAGEMENT</Link>
        )}
      </div>
      <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
        <Button type="primary" shape="round" icon={<UserOutlined />}>
          {isLoggedIn ? "Account" : "Login"}
        </Button>
      </Dropdown>
    </nav>
  );
}

export default Header;
