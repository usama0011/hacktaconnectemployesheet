import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Modal,
  Upload,
  Card,
  Table,
  Button,
  Input,
  Form,
  Select,
  message,
} from "antd";
import axios from "axios";

import {
  InboxOutlined,
  UserOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  HomeOutlined,
  LaptopOutlined,
  IdcardOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import MainLogo from "./assets/logo.png";
import "./App.css";
import { Link } from "react-router-dom";
const { Header, Content } = Layout;
const { Dragger } = Upload;
const { Option } = Select;

const App = () => {
  const BASE_URL = "http://localhost:3001/api";

  const [isUploadPopupVisible, setUploadPopupVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [searchCNIC, setSearchCNIC] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const dataSource = [
    {
      key: "1",
      name: "Ali Khan",
      shift: "Morning",
      designation: "Office Agent",
      CNIC: "12345-6789012-3",
    },
    {
      key: "2",
      name: "Sara Malik",
      shift: "Evening",
      designation: "WFH Agent",
      CNIC: "98765-4321098-7",
    },
  ];

  const columns = [
    {
      title: (
        <span>
          <IdcardOutlined /> Name
        </span>
      ),
      dataIndex: "employeename",
      key: "employeename",
    },
    {
      title: (
        <span>
          <ClockCircleOutlined /> Shift
        </span>
      ),
      dataIndex: "shift",
      key: "shift",
    },
    {
      title: (
        <span>
          <TeamOutlined /> Designation
        </span>
      ),
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: (
        <span>
          <IdcardOutlined /> CNIC
        </span>
      ),
      dataIndex: "CNIC",
      key: "CNIC",
    },
  ];
  const filteredData = employeeData.filter((item) =>
    item.CNIC.includes(searchCNIC)
  );

  const uploadProps = {
    customRequest: async ({ file, onSuccess, onError }) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `${BASE_URL}/employeereports/upload-employee-records`,
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Upload failed");
        }

        message.success("✅ CSV uploaded successfully!");
        onSuccess(result);
      } catch (error) {
        console.error("CSV Upload Error:", error);
        message.error(`❌ ${error.message}`);
        onError(error);
      }
    },
  };

  const handleCreate = async (values) => {
    const formData = new FormData();
    formData.append("employeename", values.name);
    formData.append("CNIC", values.CNIC);
    formData.append("mobileno", values.mobileno);
    formData.append("shift", values.shift);
    formData.append("designation", values.designation);

    if (values.picture && values.picture.file) {
      formData.append("picture", values.picture.file.originFileObj);
    }

    // Debug log
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await fetch(`${BASE_URL}/employeereports`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create employee");
      }

      message.success("🎉 Employee created successfully!");
      form.resetFields();
      setCreateModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error(`❌ ${error.message}`);
    }
  };
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/employeereports`);
      const data = await res.json();
      setEmployeeData(
        data.map((item, index) => ({ ...item, key: item._id || index }))
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to load employee data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (values) => {
    if (values.password === "hacktaconnect@123") {
      setPasswordModalVisible(false);
      setUploadModalVisible(true);
    } else {
      message.error("Incorrect password!");
    }
  };
  const handleUpload = async () => {
    if (!file) {
      message.error("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/uploademployeereports/upload-employee-records`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("✅ Upload successful: " + response.data.message);
      setUploadModalVisible(false);
      setFile(null);
      fetchEmployees(); // Refresh data after upload
    } catch (error) {
      message.error(
        "❌ Error uploading file: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Layout className="main-layout">
      <Header className="custom-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ width: "30px", height: "30px", objectFit: "cover" }}
            src={MainLogo}
            alt=""
          />
          <div className="logo">Hackta Connect</div>
        </div>
        <Menu theme="dark" mode="horizontal" className="custom-menu">
          <Menu.Item
            key="upload"
            icon={<UploadOutlined />}
            onClick={() => setUploadPopupVisible(true)}
          >
            Upload Employee List
          </Menu.Item>
          <Menu.Item
            key="create"
            icon={<PlusCircleOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Create Employee
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<Avatar icon={<UserOutlined />} />}>
            Logout
          </Menu.Item>
        </Menu>
      </Header>

      <Content className="main-content">
        <div className="card-section">
          {[
            {
              title: "Morning Employees",
              count: 12,
              icon: <ClockCircleOutlined />,
            },
            {
              title: "Evening Employees",
              count: 8,
              icon: <ClockCircleOutlined />,
            },
            {
              title: "Night Employees",
              count: 6,
              icon: <ClockCircleOutlined />,
            },
            {
              title: "Office Agents",
              count: 10,
              icon: <LaptopOutlined />,
            },
            {
              title: "WFH Agents",
              count: 14,
              icon: <HomeOutlined />,
            },
          ].map((card, index) => (
            <Card
              key={index}
              className="summary-card"
              title={
                <span>
                  {card.icon} {card.title}
                </span>
              }
              bordered={false}
            >
              <h2>{card.count}</h2>
            </Card>
          ))}
        </div>

        <Input.Search
          placeholder="Filter by CNIC"
          enterButton={<SearchOutlined />}
          className="search-bar"
          onChange={(e) => setSearchCNIC(e.target.value)}
        />

        <Table
          className="employee-table"
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />

        {/* Upload Info Popup */}
        <Modal
          title="Notice"
          open={isUploadPopupVisible}
          onCancel={() => setUploadPopupVisible(false)}
          footer={[
            <Button
              type="primary"
              key="next"
              onClick={() => {
                setUploadPopupVisible(false);
                setPasswordModalVisible(true);
              }}
            >
              Continue to Password
            </Button>,
          ]}
        >
          <p>You are not allowed to upload the list directly. Please verify.</p>
        </Modal>

        {/* Password Modal */}
        <Modal
          title="Enter Password"
          open={isPasswordModalVisible}
          onCancel={() => setPasswordModalVisible(false)}
          onOk={() => passwordForm.submit()}
          okText="Verify"
        >
          <Form
            form={passwordForm}
            onFinish={handlePasswordSubmit}
            layout="vertical"
          >
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter the password" }]}
            >
              <Input.Password placeholder="Enter password to continue" />
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
          <Dragger
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            fileList={file ? [file] : []}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag CSV file to this area
            </p>
          </Dragger>

          <Button
            type="primary"
            onClick={handleUpload}
            style={{ marginTop: 16 }}
            loading={uploading}
          >
            Upload Now
          </Button>
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
              name="mobileno"
              label="Mobile No"
              rules={[
                { required: true, message: "Please enter mobile number" },
              ]}
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

      <Layout.Footer className="custom-footer">
        <span>
          <UserOutlined style={{ marginRight: 6 }} />
          Developed by <strong style={{ color: "#2e7d32" }}>🅼🆄🅸🆇</strong>
        </span>
      </Layout.Footer>
    </Layout>
  );
};

export default App;
