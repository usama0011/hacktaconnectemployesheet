import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import "../styles/Login.css"; // Importing the CSS file
import MainBgLogin from "../assets/logo.png";
const BASE_URL = "http://hacktaconnectemploye-server.vercel.app/api"; // API URL

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists and redirect to dashboard
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        password: values.password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token); // Store token
        message.success("Login successful!");
        navigate("/"); // Redirect to home page (App)
      } else {
        message.error(response.data.message || "Invalid password");
      }
    } catch (error) {
      message.error("Login failed! Invalid password.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={MainBgLogin} alt="Brand Logo" className="login-logo" />
        <h2>Login</h2>
        <Form requiredMark={false} onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="password"
            label="Enter Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter Password" />
          </Form.Item>

          <Button
            style={{ backgroundColor: "#37af65", height: "50px" }}
            type="primary"
            htmlType="submit"
            loading={loading}
            className="login-btn"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
