import UserTable from "../components/admin/UserTable.jsx";
import ClearAllButton from "../components/admin/ClearAllButton.jsx";
import { AdminProvider } from "../contexts/AdminContext.jsx";
import "../css/Tasks.css";

function AdminDashboard() {
  return (
    <div className="tasks-container">
      <AdminProvider>
        <h1>Admin Dashboard</h1>
        <UserTable />
        <ClearAllButton />
      </AdminProvider>
    </div>
  );
}

export default AdminDashboard;
