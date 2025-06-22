import { useState } from "react";
import LoginForm from "../components/login/Login";
import TabButton from "../components/login/TabButton";

const LoginTabs = () => {
  const [activeTab, setActiveTab] = useState("Login");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="form-container flex h-screen flex-col items-center justify-center max-w-sm">
        {/* Tabs */}
        <div className="tabs flex py-4">
          <TabButton
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            tab="Login"
          />
          <TabButton
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            tab="Register"
          />
        </div>
        {/* Content */}
        <LoginForm mode={activeTab} />
      </div>
    </div>
  );
};

export default LoginTabs;
