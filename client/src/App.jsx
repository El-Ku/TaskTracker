import { Routes, Route } from "react-router-dom";
import LoginTabs from "./pages/LoginTabs";
import ProfilePage from "./pages/ProfilePage";
import Tasks from "./components/tasks/Tasks";

function App() {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<LoginTabs />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </main>
  );
}

export default App;
