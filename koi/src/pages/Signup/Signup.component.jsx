import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Signup.scss";
import api from "../../config/axios";
import koiLogo from "../../assets/koilogo.png";
import koiBackground from "../../assets/koibackground.jpg";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    userAddress: Yup.string().required("Address is required"),
    userPhoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      userAddress: "",
      userPhoneNumber: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post("/api/auth/register", {
          usertype: "Customer",
          ...values,
        });
        toast.success("Registration successful!");
        navigate("/login");
      } catch (error) {
        toast.error("Registration failed. Please try again.");
        console.error("Error registering:", error);
      }
    },
  });

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
          <form className="signup-form" onSubmit={formik.handleSubmit}>
            <h2>Signup</h2>
            <p>Create your account</p>
            {formik.errors.submit && (
              <p className="error-message">{formik.errors.submit}</p>
            )}

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="johndoe"
                required
              />
              {formik.touched.username && formik.errors.username ? (
                <p className="error-message">{formik.errors.username}</p>
              ) : null}
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="johndoe@mail.com"
                required
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="error-message">{formik.errors.email}</p>
              ) : null}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="*********"
                required
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="error-message">{formik.errors.password}</p>
              ) : null}
            </div>

            <div className="input-group">
              <label htmlFor="userAddress">Address</label>
              <input
                type="text"
                id="userAddress"
                value={formik.values.userAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="123 Main St, Anytown, USA"
                required
              />
              {formik.touched.userAddress && formik.errors.userAddress ? (
                <p className="error-message">{formik.errors.userAddress}</p>
              ) : null}
            </div>

            <div className="input-group">
              <label htmlFor="userPhoneNumber">Phone Number</label>
              <input
                type="text"
                id="userPhoneNumber"
                value={formik.values.userPhoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="1234567890"
                required
              />
              {formik.touched.userPhoneNumber &&
              formik.errors.userPhoneNumber ? (
                <p className="error-message">{formik.errors.userPhoneNumber}</p>
              ) : null}
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
                Already have an account? <Link to="/login">Login!</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
