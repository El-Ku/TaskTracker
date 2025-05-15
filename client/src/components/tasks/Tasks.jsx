import TaskInput from "./TaskInput";
import TaskTable from "./TaskTable";
import { TasksProvider } from "../../contexts/TasksContext.jsx";
import "../../css/Tasks.css";

function Tasks() {
  return (
    <div>
      <TasksProvider>
        <TaskInput />
        <TaskTable />
      </TasksProvider>
    </div>
  );
}

export default Tasks;
