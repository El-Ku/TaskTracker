import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedSelectAll, setSelectedSelectAll] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        users,
        setUsers,
        originalUsers,
        setOriginalUsers,
        editUserId,
        setEditUserId,
        editValue,
        setEditValue,
        error,
        setError,
        selectedRows,
        setSelectedRows,
        selectedSelectAll,
        setSelectedSelectAll,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
