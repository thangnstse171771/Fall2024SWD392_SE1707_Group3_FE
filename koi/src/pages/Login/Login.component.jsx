import React from "react";
import "./Login.scss";
import koiLogo from "../../assets/koilogo.png";
import koiBackground from "../../assets/koibackground.jpg";

const Login = () => {
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
          <form className="login-form">
            <h2>Login</h2>
            <p>Login to access your account</p>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="nguoichothue" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="*********" />
            </div>
            <div className="login-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember Me</label>
              </div>
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
                Don't have an account? <a href="/register">Register!</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
