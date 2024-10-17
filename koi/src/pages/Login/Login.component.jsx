import React, { useState } from "react";
import "./Login.scss";
import api from "../../config/axios";
import koiLogo from "../../assets/koilogo.png";
import koiBackground from "../../assets/koibackground.jpg";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", {
        username,
        password,
      });
      console.log(response.data);

      if (response.data.token) {
        // Lưu token và usertype vào localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usertype", response.data.user.usertype); // Lưu usertype
        toast.success("Đăng nhập thành công!");
        navigate("/"); // Điều hướng tới trang chủ
      } else {
        setErrorMessage("Đăng nhập thất bại. Không tìm thấy token.");
      }
    } catch (error) {
      setErrorMessage(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu."
      );
      console.error(
        "Lỗi trong quá trình đăng nhập:",
        error.response?.data || error.message
      );
    } finally {
      setPassword("");
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${koiBackground})` }}
    >
      <div className="login-box">
        <div className="logo-section">
          <img src={koiLogo} alt="Koi Logo" className="logo" />
        </div>
        <div className="form-section">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <p>Login to access your account</p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*********"
                required
              />
            </div>
            <div className="login-options">
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            <div className="alternative-login">
              <p>Or</p>
              <button className="google-login">Login with Google</button>
            </div>
            <div className="signup">
              <p>
                Don't have an account? <Link to="/Sign-in">Register!</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
