import UserTable from "../components/admin/UserTable.jsx";
import ClearAllButton from "../components/admin/ClearAllButton.jsx";
import { AdminProvider } from "../contexts/AdminContext.jsx";
import AddNewUsers from "../components/admin/AddNewUsers.jsx";

function AdminDashboard() {
  return (
    <div className="flex flex-col ml-2 mr-2 sm:ml-6 sm:mr-6 min-w-2xl">
      <AdminProvider>
        <h1 className="flex flex-col items-center text-4xl font-bold m-4">
          Admin Dashboard
        </h1>
        <AddNewUsers />
        <UserTable />
        <ClearAllButton />
      </AdminProvider>
    </div>
  );
}

export default AdminDashboard;
