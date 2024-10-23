import React, { useState, useEffect } from "react";
import "./ResetPassword.scss";
import api from "../../config/axios";
import koiLogo from "../../assets/koilogo.png";
import koiBackground from "../../assets/koibackground.jpg";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL params

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post("/api/auth/reset-password", {
        newPassword,
        token, // Include token in the request
      });
      console.log(response.data);

      toast.success("Password has been reset successfully!");
      navigate("/login"); // Navigate back to the login page
    } catch (error) {
      setErrorMessage("Failed to reset password. Please try again.");
      console.error(
        "Error during password reset:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div
      className="reset-password-container"
      style={{ backgroundImage: `url(${koiBackground})` }}
    >
      <div className="reset-password-box">
        <div className="logo-section">
          <img src={koiLogo} alt="Koi Logo" className="logo" />
        </div>
        <div className="form-section">
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            <p>Enter your new password</p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </div>
            <button type="submit" className="reset-password-button">
              Reset Password
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

export default ResetPassword;
