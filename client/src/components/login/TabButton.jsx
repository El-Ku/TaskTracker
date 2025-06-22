import React from "react";

function TabButton({ activeTab, handleTabClick, tab }) {
  return (
    <button
      className={
        activeTab === tab
          ? "mx-1 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          : "mx-1 px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
      }
      onClick={() => handleTabClick(tab)}
    >
      {tab}
    </button>
  );
}

export default TabButton;
