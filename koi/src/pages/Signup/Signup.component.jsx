import React, { useState } from "react";
import "./Signup.scss";
import api from "../../config/axios";
import koiLogo from "../../assets/koilogo.png";
import koiBackground from "../../assets/koibackground.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/user/register", {
        userType: "Customer",
        username: username,
        email: email,
        password: password,
        userAddress: userAddress,
        userPhoneNumber: userPhoneNumber,
      });

      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      setErrorMessage("Registration failed. Please check your information.");
      console.error("Error registering:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="signup-container"
      style={{ backgroundImage: `url(${koiBackground})` }}
    >
      <div className="signup-box">
        <div className="logo-section">
          <img src={koiLogo} alt="Koi Logo" className="logo" />
        </div>
        <div className="form-section">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <p>Create your account</p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@mail.com"
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
            <div className="input-group">
              <label htmlFor="userAddress">Address</label>
              <input
                type="text"
                id="userAddress"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="123 Main St, Anytown, USA"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="userPhoneNumber">Phone Number</label>
              <input
                type="text"
                id="userPhoneNumber"
                value={userPhoneNumber}
                onChange={(e) => setUserPhoneNumber(e.target.value)}
                placeholder="1234567890"
                required
              />
            </div>
            <button type="submit" className="signup-button">
              Register
            </button>
            <div className="alternative-login">
              <p>Or</p>
              <button className="google-login">Sign up with Google</button>
            </div>
            <div className="login">
              <p>
                Already have an account? <a href="/login">Login!</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
