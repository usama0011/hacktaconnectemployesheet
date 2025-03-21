import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const BASE_URL = "http://hacktaconnectemploye-server.vercel.app/api"; // API URL

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      <h2>Login</h2>
      <Form onFinish={handleLogin} layout="vertical">
        <Form.Item
          name="password"
          label="Enter Password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Enter Password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
