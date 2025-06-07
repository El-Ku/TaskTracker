import { Routes, Route } from "react-router-dom";
import LoginTabs from "./pages/LoginTabs";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Navbar from "./components/Navbar";
import ProtectedLayout from "./components/ProtectedLayout";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <main className="main-content">
      <Navbar />
      <Routes>
        <Route path="/tasktracker" element={<LoginTabs />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/logout" element={<LoginTabs />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
