import React, { useState } from "react";
import "./Login.scss";
import api from "../../config/axios";
import koiLogo from "../../assets/koilogo.png";
import koiBackground from "../../assets/koibackground.jpg";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/user/login", {
        email: email,
        password: password,
      });

      const { data } = response.data;

      toast.success("Login successful!");
      navigate("/");
      // Luôn lưu token vào sessionStorage hoặc localStorage
      sessionStorage.setItem("token", data.token); // Bạn có thể thay thành localStorage nếu muốn lưu lâu dài
    } catch (error) {
      setErrorMessage("Login failed. Please check your email or password.");
      console.error("Error logging in:", error);
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nguoichothue@mail.com"
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
              <button className="google-login">Login with google</button>
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
