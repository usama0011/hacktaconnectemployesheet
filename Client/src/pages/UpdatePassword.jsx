import React, { useState } from "react";
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
import { Content, Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import "../App.css";

const { Dragger } = Upload;

const UpdatePassword = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form] = Form.useForm();

  const handleVerifyPassword = (values) => {
    if (values.currentPassword === "muix@123") {
      setIsPasswordVerified(true);
      setIsModalVisible(true);
      message.success("Password verified");
    } else {
      message.error("Incorrect current password");
    }
  };

  const handleUpdatePassword = (values) => {
    console.log("New Password:", values.newPassword);
    message.success("Password updated successfully!");
    setIsModalVisible(false);
    form.resetFields();
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
        <Card
          title={
            <span>
              <LockOutlined /> Current Password
            </span>
          }
          extra={
            <>
              <EditOutlined
                style={{ marginRight: 16, cursor: "pointer" }}
                onClick={() => setIsModalVisible(true)}
              />
              {showPassword ? (
                <EyeInvisibleOutlined
                  onClick={() => setShowPassword(false)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <EyeOutlined
                  onClick={() => setShowPassword(true)}
                  style={{ cursor: "pointer" }}
                />
              )}
            </>
          }
          style={{ maxWidth: 400 }}
        >
          <p>{showPassword ? "HacktaConnect@123" : "••••••••••••"}</p>
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
            onFinish={handleVerifyPassword}
            layout="vertical"
          >
            <Form.Item
              name="currentPassword"
              label="Enter Varification Password"
              rules={[{ required: true, message: "varification is required" }]}
            >
              <Input.Password placeholder="Enter varification password" />
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
          <Form form={form} onFinish={handleUpdatePassword} layout="vertical">
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
            form={form}
            requiredMark={false}
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
      </Content>
    </Layout>
  );
};

export default UpdatePassword;
