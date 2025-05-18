import TaskInput from "../components/tasks/TaskInput.jsx";
import TaskTable from "../components/tasks/TaskTable.jsx";
import ClearAllButton from "../components/tasks/ClearAllButton.jsx";
import { TasksProvider } from "../contexts/TasksContext.jsx";
import "../css/Tasks.css";

function Tasks() {
  return (
    <div className="tasks-container">
      <TasksProvider>
        <TaskInput />
        <TaskTable />
        <ClearAllButton />
      </TasksProvider>
    </div>
  );
}

export default Tasks;
