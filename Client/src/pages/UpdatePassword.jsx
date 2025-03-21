import React, { useEffect, useState } from "react";
import {
  PlusCircleOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
  EditOutlined,
  InboxOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Layout,
  Menu,
  Select,
  Modal,
  Upload,
  Form,
  Input,
  Button,
  message,
  Card,
} from "antd";
import axios from "axios";

import { Content, Header } from "antd/es/layout/layout";
import { Link, useNavigate } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import "../App.css";

const { Dragger } = Upload;

const UpdatePassword = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const BASE_URL = "https://hacktaconnectemploye-server.vercel.app/api/auth"; // Change to your API URL
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [confirmationForm] = Form.useForm();

  const [visiblePasswords, setVisiblePasswords] = useState({});
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const handleVerifyPassword = async (values) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        password: values.currentPassword, // Sending entered password to API
      });

      if (response.data.success) {
        setIsPasswordVerified(true); // ✅ Mark password as verified
        setIsModalVisible(true); // ✅ Open the Update Password Modal
        message.success("Password verified successfully!");
      } else {
        message.error("Incorrect current password");
      }
    } catch (error) {
      message.error("Incorrect password, please try again.");
    }
  };
  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleUpdatePassword = async (values) => {
    try {
      const response = await axios.post(`${BASE_URL}/update-password`, {
        newPassword: values.newPassword,
        userId: selectedUser?._id,
      });

      if (response.data.success) {
        message.success("Password updated successfully!");
        form.resetFields();
        setIsModalVisible(false);
        setIsPasswordVerified(false);
        setSelectedUser(null);
        // Refresh the list
        const updated = await axios.get(`${BASE_URL}/all-passwords`);
        setUsers(updated.data.users);
      } else {
        message.error(response.data.message || "Password update failed");
      }
    } catch (error) {
      message.error("Failed to update password, please try again.");
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    action: "/api/employeereports/upload-csv",
  };

  const handleCreate = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("CNIC", values.CNIC);
    formData.append("shift", values.shift);
    formData.append("designation", values.designation);
    if (values.picture && values.picture.file) {
      formData.append("picture", values.picture.file.originFileObj);
    }

    console.log("Form Data for Upload:", values);
    message.success("Employee created successfully!");
    form.resetFields();
    setCreateModalVisible(false);
  };

  const checkUserAuthenticated = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login...");
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Error checking user authentication:", error);
      message.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    checkUserAuthenticated();
  }, [navigate]);

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/all-passwords`);
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        message.error("Failed to fetch passwords");
      }
    };

    fetchPasswords();
    checkUserAuthenticated(); // ✅ Now this works
  }, []);

  return (
    <Layout className="main-layout">
      <Header className="custom-header">
        <div className="logo">
          <Link style={{ color: "unset" }} to="/">
            Hackta Connect
          </Link>
        </div>
        <Menu theme="dark" mode="horizontal" className="custom-menu">
          <Menu.Item
            key="upload"
            icon={<UploadOutlined />}
            onClick={() => message.info("Upload Modal trigger")}
          >
            Upload Employee List
          </Menu.Item>
          <Menu.Item
            key="create"
            icon={<PlusCircleOutlined />}
            onClick={() => message.info("Create Modal trigger")}
          >
            Create Employee
          </Menu.Item>

          <Menu.Item key="logout" icon={<Avatar icon={<UserOutlined />} />}>
            Logout
          </Menu.Item>
        </Menu>
      </Header>

      <Content className="main-content">
        <Card title="All Users & Passwords" style={{ marginTop: 24 }}>
          {users.length > 0 ? (
            users.map((user) => (
              <Card
                key={user._id}
                type="inner"
                title={`Login ID: ${user._id}`}
                extra={
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setSelectedUser(user);
                      setIsConfirmationModalVisible(true); // Show confirmation modal
                    }}
                  >
                    Update Password
                  </Button>
                }
                style={{ marginBottom: 16 }}
              >
                <p>
                  Password:{" "}
                  {visiblePasswords[user._id] ? user.password : "••••••••••••"}{" "}
                  <span
                    style={{ cursor: "pointer", marginLeft: 8 }}
                    onClick={() => togglePasswordVisibility(user._id)}
                  >
                    {visiblePasswords[user._id] ? (
                      <EyeInvisibleOutlined />
                    ) : (
                      <EyeOutlined />
                    )}
                  </span>
                </p>
              </Card>
            ))
          ) : (
            <p>No users found</p>
          )}
        </Card>

        {/* Password Verification Modal */}
        <Modal
          title="Varification Code"
          open={!isPasswordVerified && isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
          okText="Verify"
        >
          <Form
            requiredMark={false}
            form={form}
            onFinish={handleVerifyPassword} // 🔥 This triggers verification
            layout="vertical"
          >
            <Form.Item
              name="currentPassword"
              label="Enter Verification Password"
              rules={[{ required: true, message: "Verification is required" }]}
            >
              <Input.Password placeholder="Enter verification password" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Update Password Modal */}
        <Modal
          title="Update Password"
          open={isPasswordVerified && isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
          okText="Update"
        >
          <Form
            requiredMark={false}
            form={form}
            onFinish={handleUpdatePassword}
            layout="vertical"
          >
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter a new password" },
              ]}
            >
              <Input.Password placeholder="New password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>
          </Form>
        </Modal>
        {/* Upload Modal */}
        <Modal
          title="Upload CSV"
          open={isUploadModalVisible}
          onCancel={() => setUploadModalVisible(false)}
          footer={null}
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </Modal>

        {/* Create Employee Modal */}
        <Modal
          title="Create Employee"
          open={isCreateModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onOk={() => form.submit()}
        >
          <Form
            requiredMark={false}
            form={form}
            layout="vertical"
            onFinish={handleCreate}
          >
            <Form.Item
              name="name"
              label="Employee Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="CNIC"
              label="CNIC"
              rules={[{ required: true, message: "Please enter CNIC" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="shift"
              label="Shift"
              rules={[{ required: true, message: "Please select shift" }]}
            >
              <Select>
                <Option value="Morning">Morning</Option>
                <Option value="Evening">Evening</Option>
                <Option value="Night">Night</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: "Please select designation" }]}
            >
              <Select>
                <Option value="Office Agent">Office Agent</Option>
                <Option value="WFH Agent">WFH Agent</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="picture"
              label="Upload Image"
              valuePropName="file"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e && e.fileList.length ? e : null;
              }}
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
              >
                <Button icon={<InboxOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Enter Admin Password"
          open={isConfirmationModalVisible}
          onCancel={() => setIsConfirmationModalVisible(false)}
          onOk={() => confirmationForm.submit()}
          okText="Confirm"
        >
          <Form
            requiredMark={false}
            form={confirmationForm}
            onFinish={({ adminPassword }) => {
              if (adminPassword === "muix@123") {
                setIsConfirmationModalVisible(false);
                setIsModalVisible(true);
                setIsPasswordVerified(true);
              } else {
                message.error("Incorrect admin password!");
              }
            }}
            layout="vertical"
          >
            <Form.Item
              name="adminPassword"
              label="Admin Password"
              rules={[{ required: true, message: "Please enter the password" }]}
            >
              <Input.Password placeholder="Enter admin password" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default UpdatePassword;
