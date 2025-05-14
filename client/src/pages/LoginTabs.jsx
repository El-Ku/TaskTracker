import React, { useState } from "react";
import "../css/login.css";
import LoginForm from "../components/Login";

const LoginTabs = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="form-container">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => handleTabClick("login")}
        >
          Login
        </button>
        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => handleTabClick("register")}
        >
          Register
        </button>
      </div>

      {/* Content */}
      {activeTab === "login" ? (
        <LoginForm mode="login" />
      ) : (
        <LoginForm mode="register" />
      )}
    </div>
  );
};

export default LoginTabs;
