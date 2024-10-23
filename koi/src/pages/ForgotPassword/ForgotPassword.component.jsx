import React, { useState } from "react";
import "./ForgotPassword.scss";
import api from "../../config/axios";
import koiLogo from "../../assets/koilogo.png";
import koiBackground from "../../assets/koibackground.jpg";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/forgot-password", { email });
      console.log(response.data);

      toast.success("Reset link sent to your email!");
      navigate("/Login"); // Navigate back to the login page or any other page you prefer
    } catch (error) {
      setErrorMessage("Failed to send reset link. Please check your email.");
      console.error(
        "Error during password reset:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div
      className="forgot-password-container"
      style={{ backgroundImage: `url(${koiBackground})` }}
    >
      <div className="forgot-password-box">
        <div className="logo-section">
          <img src={koiLogo} alt="Koi Logo" className="logo" />
        </div>
        <div className="form-section">
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password</p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="forgot-password-button">
              Send Reset Link
            </button>
            <div className="login-link">
              <p>
                Remembered your password? <Link to="/login">Login!</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
