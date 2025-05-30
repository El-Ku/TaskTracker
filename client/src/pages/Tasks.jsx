import TaskInput from "../components/tasks/TaskInput.jsx";
import TaskTable from "../components/tasks/TaskTable.jsx";
import ClearAllButton from "../components/tasks/ClearAllButton.jsx";
import { TasksProvider } from "../contexts/TasksContext.jsx";

function Tasks() {
  return (
    <div className="flex flex-col ml-6">
      <TasksProvider>
        <h1 className="flex flex-col items-center text-4xl font-bold m-4">
          Task Manager
        </h1>
        <TaskInput />
        <TaskTable />
        <ClearAllButton />
      </TasksProvider>
    </div>
  );
}

export default Tasks;
