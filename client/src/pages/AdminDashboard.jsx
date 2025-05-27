import UserTable from "../components/admin/UserTable.jsx";
import ClearAllButton from "../components/admin/ClearAllButton.jsx";
import { AdminProvider } from "../contexts/AdminContext.jsx";
import AddNewUsers from "../components/admin/AddNewUsers.jsx";
import SyncToDBButton from "../components/admin/SyncToDBButton.jsx";
import "../css/Admin.css";

function AdminDashboard() {
  return (
    <div className="tasks-container">
      <AdminProvider>
        <h1>Admin Dashboard</h1>
        <AddNewUsers />
        <UserTable />
        <SyncToDBButton />
        <ClearAllButton />
      </AdminProvider>
    </div>
  );
}

export default AdminDashboard;
