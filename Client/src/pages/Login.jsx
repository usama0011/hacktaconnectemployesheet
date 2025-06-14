import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Layout } from "antd";
import axios from "axios";
import "../styles/Login.css"; // Importing the CSS file
import MainBgLogin from "../assets/logo.png";

const { Footer } = Layout;
const BASE_URL = "https://hacktaconnectemploye-server.vercel.app/api"; // API URL

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
useEffect(() => {
  // Always clear token on login page load
  localStorage.removeItem("token");
}, []);


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
      alert(error.response.data.message)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error({
          content: error.response.data.message,
          duration: 3,
          style: { marginTop: "70px" },
        });
      } else {
        message.error("Login failed! Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <Layout className="login-layout">
      <div className="login-container">
        <div className="login-box">
          <img src={MainBgLogin} alt="Brand Logo" className="login-logo" />
          <h2>𝐇𝐚𝐜𝐤𝐭𝐚 𝐂𝐨𝐧𝐧𝐞𝐜𝐭 𝐋𝐨𝐠𝐢𝐧</h2>
          <Form requiredMark={false} onFinish={handleLogin} layout="vertical">
            <Form.Item
              name="password"
              label={<span style={{ color: "white" }}>Enter Password</span>}
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Enter Password" />
            </Form.Item>

            <Button
              style={{ backgroundColor: "#37af65", height: "45px" }}
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

      {/* Footer Layout */}
      <Footer className="login-footer">
        Developed by <strong style={{ color: "#2e7d32" }}>Muix</strong>
      </Footer>
    </Layout>
  );
};

export default Login;
