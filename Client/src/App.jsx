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
  Dropdown,
  Tag,
  Space,
} from "antd";
import axios from "axios";
import moment from "moment";
import { Skeleton } from "antd";
import { Drawer } from "antd";
import { MenuOutlined, MoreOutlined } from "@ant-design/icons";

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
  PhoneOutlined,
  ManOutlined,
} from "@ant-design/icons";
import MainLogo from "./assets/logo.png";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
const { Header, Content } = Layout;
const { Dragger } = Upload;
const { Option } = Select;
//https://hacktaconnectemploye-server.vercel.app/api
const App = () => {
  const BASE_URL = "https://hacktaconnectemploye-server.vercel.app/api";
  const [cardStats, setCardStats] = useState([]); // 👈 add state for cards
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
  });
  const [isUploadPopupVisible, setUploadPopupVisible] = useState(false);
  const [tagStatusMap, setTagStatusMap] = useState({});
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [inputCNIC, setInputCNIC] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputStatus, setInputStatus] = useState("");

  const [password, setPassword] = useState("");
  const [searchCNIC, setSearchCNIC] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const statusColors = {
    Live: "green",
    Resigned: "orange", // ✅ Add this!
    Terminated: "red",
  };

  const columns = [
    {
      title: "No#",
      key: "index",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: (
        <span>
          <IdcardOutlined /> Employe Name
        </span>
      ),
      dataIndex: "employeename",
      key: "employeename",
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => {
        const currentStatus = record.status || "Live";

        return (
          <Dropdown
            overlay={
              <Menu>
                {["Live", "Resigned", "Terminated"].map((status) => (
                  <Menu.Item
                    key={status}
                    onClick={() => handleStatusChange(record, status)}
                  >
                    <Space>
                      <span
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor:
                            status === "Live"
                              ? "green"
                              : status === "Resigned"
                              ? "orange"
                              : "red",
                        }}
                      />
                      {status}
                    </Space>
                  </Menu.Item>
                ))}
              </Menu>
            }
            trigger={["click"]}
          >
            <Space>
              <Tag
                color={
                  currentStatus === "Live"
                    ? "green"
                    : currentStatus === "Resigned"
                    ? "orange"
                    : "red"
                }
              >
                {currentStatus}
              </Tag>
              <MoreOutlined style={{ cursor: "pointer" }} />
            </Space>
          </Dropdown>
        );
      },
    },

    {
      title: (
        <span>
          <ClockCircleOutlined /> Employe Shift
        </span>
      ),
      dataIndex: "shift",
      key: "shift",
    },
    {
      title: (
        <span>
          <TeamOutlined /> Employe Designation
        </span>
      ),
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: (
        <span>
          <IdcardOutlined />
          Employe CNIC
        </span>
      ),
      dataIndex: "CNIC",
      key: "CNIC",
    },
    {
      title: (
        <span>
          <HomeOutlined />
          Employe Branch
        </span>
      ),
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: (
        <span>
          <PhoneOutlined />
          Mobile
        </span>
      ),
      dataIndex: "mobileno",
      key: "mobileno",
    },
    {
      title: (
        <span>
          <ManOutlined />
          Created AT
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("MMMM Do YYYY"), // 👈 Format Date
    },
  ];
  const handleStatusChange = (record, newStatus) => {
    setPendingStatusUpdate({ id: record._id, status: newStatus });
    setPassword("");
    setStatusModalVisible(true);
  };

  const filteredData = employeeData.filter((item) =>
    item.CNIC.includes(searchCNIC)
  );
  const applyFilters = () => {
    setSearchCNIC(inputCNIC);
    setSearchName(inputName);
    setFilterStatus(inputStatus);
  };

  const handleCreate = async (values) => {
    const cleanedCNIC = values.CNIC.replace(/-/g, "");

    if (!/^\d{13}$/.test(cleanedCNIC)) {
      message.error("CNIC must be exactly 13 digits without dashes.");
      return;
    }

    const formData = new FormData();
    formData.append("employeename", values.name);
    formData.append("CNIC", cleanedCNIC); // ✅ sanitized CNIC
    formData.append("mobileno", values.mobileno);
    formData.append("shift", values.shift);
    formData.append("designation", values.designation);
    formData.append("branch", values.branch);

    if (values.picture && values.picture.file) {
      formData.append("picture", values.picture.file.originFileObj);
    }

    try {
      const response = await fetch(`${BASE_URL}/employeereports`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // 🔍 Check for duplicate CNIC message
        if (result.message?.includes("CNIC")) {
          message.error("❌ An employee with this CNIC already exists.");
        } else {
          throw new Error(result.message || "Failed to create employee");
        }
        return;
      }

      message.success("🎉 Employee created successfully!");
      form.resetFields();
      setCreateModalVisible(false);
      fetchEmployees(); // Refresh list
    } catch (error) {
      console.error(error);
      message.error(`❌ ${error.message}`);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/employeereports`, {
        params: {
          name: searchName,
          cnic: searchCNIC,
          status: filterStatus,
        },
      });
      const data = res.data;

      const sortedData = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((item, index) => ({ ...item, key: item._id || index }));

      setEmployeeData(sortedData);
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to load employee data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCardStats = async () => {
    try {
      setLoading(true); // 👈 add this
      const res = await fetch(`${BASE_URL}/employrecorcdcount/summary`);
      const data = await res.json();
      setCardStats(data);
    } catch (err) {
      console.error("Error loading card stats", err);
      message.error("Failed to load summary data.");
    } finally {
      setLoading(false); // 👈 and this
    }
  };

  const handlePasswordSubmit = (values) => {
    if (values.password === "Muix@123") {
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
  const confirmStatusUpdate = async () => {
    if (password !== "Hackta@@$tatus") {
      message.error("Incorrect password");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/employeereports/${pendingStatusUpdate.id}`, {
        status: pendingStatusUpdate.status,
      });
      message.success("Status updated successfully");
      setStatusModalVisible(false);
      fetchEmployees(); // Refresh data
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const getCardIcon = (title) => {
    if (title.includes("Office"))
      return (
        <img
          style={{ width: "20px", height: "20px" }}
          src="https://img.icons8.com/?size=50&id=mBUZsi8BBR6a&format=png"
          alt=""
        />
      );
    if (title.includes("WFH") || title.includes("WFH"))
      return (
        <img
          style={{ width: "20px", height: "20px" }}
          src="https://img.icons8.com/?size=24&id=83326&format=png"
          alt=""
        />
      );
    // Fallbacks based on shift, if designation isn't present
    if (title.includes("Morning"))
      return (
        <img
          style={{ width: "20px", height: "20px" }}
          src="https://img.icons8.com/?size=24&id=83326&format=png"
          alt=""
        />
      );
    if (title.includes("Evening"))
      return (
        <img
          style={{ width: "20px", height: "20px" }}
          src="https://img.icons8.com/?size=24&id=83326&format=png"
          alt=""
        />
      );
    if (title.includes("Night"))
      return (
        <img
          style={{ width: "20px", height: "20px" }}
          src="https://img.icons8.com/?size=24&id=83326&format=png"
          alt=""
        />
      );

    // Default fallback
    return <TeamOutlined />;
  };

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token
    }
  }, [navigate]);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    message.success("Logged out successfully!");
    navigate("/login");
  };
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
    });
  };

  useEffect(() => {
    fetchEmployees();
    fetchCardStats(); // 👈 fetch card data on load
  }, [searchCNIC, searchName, filterStatus]);
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [searchCNIC, searchName, filterStatus]);

  const renderTagMenu = (record) => (
    <Menu
      onClick={({ key }) => {
        setTagStatusMap((prev) => ({ ...prev, [record._id]: key }));
      }}
      items={["Live", "Resigned", "Terminated"].map((status) => ({
        key: status,
        label: (
          <Space>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: statusColors[status],
              }}
            />
            {status}
          </Space>
        ),
      }))}
    />
  );

  return (
    <Layout className="main-layout">
      <Header className="custom-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ width: "25px", height: "25px", objectFit: "cover" }}
            src={MainLogo}
            alt=""
          />
          <div className="logo">Hackta Connect</div>
        </div>
        {/* Desktop Menu */}
        <Menu
          theme="dark"
          mode="horizontal"
          className="custom-menu desktop-menu"
        >
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
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>

        {/* Mobile Hamburger Icon */}
        <MenuOutlined
          className="mobile-menu-icon"
          onClick={() => setDrawerVisible(true)}
        />

        {/* Drawer for Mobile */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <Menu mode="vertical">
            <Menu.Item
              key="upload"
              icon={<UploadOutlined />}
              onClick={() => {
                setUploadPopupVisible(true);
                setDrawerVisible(false);
              }}
            >
              Upload Employee List
            </Menu.Item>
            <Menu.Item
              key="create"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setCreateModalVisible(true);
                setDrawerVisible(false);
              }}
            >
              Create Employee
            </Menu.Item>
            <Menu.Item
              key="settings"
              icon={<SettingOutlined />}
              onClick={() => {
                setDrawerVisible(false);
                navigate("/settings");
              }}
            >
              Settings
            </Menu.Item>
            <Menu.Item
              key="logout"
              icon={<LogoutOutlined />}
              onClick={() => {
                handleLogout();
                setDrawerVisible(false);
              }}
            >
              Logout
            </Menu.Item>
          </Menu>
        </Drawer>
      </Header>

      <Content className="main-content">
        <div className="card-section">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card className="summary-card" key={index}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              ))
            : cardStats.map((card, index) => (
                <Card
                  key={index}
                  className="summary-card"
                  title={
                    <span
                      style={{
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ marginRight: "10px", marginTop: "7px" }}>
                        {" "}
                      </span>{" "}
                      <span> {card.title}</span>
                    </span>
                  }
                  bordered={false}
                >
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {card.count}
                  </p>
                </Card>
              ))}
        </div>

        <div
          className="filters-wrapper"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
            marginBottom: 20,
          }}
        >
          <Input style={{width:"230px"}}
            placeholder="Search by CNIC"
            value={inputCNIC}
            onChange={(e) => setInputCNIC(e.target.value)}
            allowClear
          />
          <Input style={{width:"230px"}}
            placeholder="Search by Name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            allowClear
          />
          <Select 
            placeholder="Choose Status"
            style={{ minWidth: 230 }}
            value={inputStatus}
            onChange={(value) => setInputStatus(value)}
            allowClear
          >
            <Option value="" disabled>
              Choose Status
            </Option>
            <Option value="Live">Live</Option>
            <Option value="Resigned">Resigned</Option>
            <Option value="Terminated">Terminated</Option>
          </Select>

          <Button type="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button type="dashed"
            onClick={() => {
              setInputCNIC("");
              setInputName("");
              setInputStatus("");
              setSearchCNIC("");
              setSearchName("");
              setFilterStatus("");
            }}
          >
            Reset Filters
          </Button>
        </div>

        {loading ? (
          <Card className="employee-table">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        ) : (
          <Table
            className="employee-table"
            dataSource={employeeData} // <--- use this directly
            columns={columns}
            onChange={handleTableChange} // 👈 this is required
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["30", "50", "100"], // 👈 add options
            }}
          />
        )}

        {/* Upload Info Popup */}
        <Modal
          title="Notice"
          open={isUploadPopupVisible}
          onCancel={() => setUploadPopupVisible(false)}
          footer={[
            <Button
              style={{ backgroundColor: "crimson", color: "white" }}
              type="danger"
              key="next"
              onClick={() => {
                setUploadPopupVisible(false);
                setPasswordModalVisible(true);
              }}
            >
              You can't upload file
            </Button>,
          ]}
        >
          <p>Not Available</p>
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
              rules={[
                { required: true, message: "Please enter CNIC" },
                {
                  pattern: /^[0-9]{13}$/,
                  message: "CNIC must be 13 digits without dashes",
                },
              ]}
            >
              <Input
                maxLength={13}
                onChange={(e) => {
                  const noDashes = e.target.value.replace(/-/g, "");
                  form.setFieldsValue({ CNIC: noDashes });
                }}
                placeholder="e.g., 3520112345671"
              />
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
              <Select placeholder="Select a shift">
                <Option value="Morning">🌅 Morning Shift</Option>
                <Option value="Evening">🌇 Evening Shift</Option>
                <Option value="Night">🌙 Night Shift</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="branch"
              label="branch"
              rules={[{ required: true, message: "Please select branch" }]}
            >
              <Select>
                <Option value="Commercial">Commercial</Option>
                <Option value="Bahria">Bahria</Option>
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
          </Form>
        </Modal>
        <Modal
          title="Enter Password to Update Status"
          open={isStatusModalVisible}
          onOk={confirmStatusUpdate}
          onCancel={() => setStatusModalVisible(false)}
        >
          <Input.Password
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal>
      </Content>

      <Layout.Footer className="custom-footer">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{ width: "25px", height: "25px" }}
            src="https://img.icons8.com/?size=80&id=6z06wCF5xvcW&format=png"
            alt=""
          />
          Developed by{" "}
          <strong style={{ color: "green", marginLeft: "5px" }}>Muix</strong>
        </span>
      </Layout.Footer>
    </Layout>
  );
};

export default App;
