import TaskInput from "./TaskInput";
import TaskTable from "./TaskTable";
import UpperNavBar from "./UpperNavBar.jsx";
import { TasksProvider } from "../../contexts/TasksContext.jsx";
import "../../css/Tasks.css";

function Tasks() {
  return (
    <div className="tasks-container">
      <TasksProvider>
        <UpperNavBar />
        <TaskInput />
        <TaskTable />
      </TasksProvider>
    </div>
  );
}

export default Tasks;
