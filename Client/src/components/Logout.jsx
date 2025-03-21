import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/login"); // Redirect to Login Page
  };

  return (
    <Button type="danger" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
