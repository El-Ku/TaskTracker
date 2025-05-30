import React from "react";
import { useTasks } from "../../contexts/TasksContext";

function SingleActionButton({ action, text }) {
  const { selectedRows } = useTasks();

  return (
    <button
      className="m-1 px-1 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 min-w-35 max-w-40 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={async () => action()}
      disabled={!selectedRows || selectedRows.length === 0}
    >
      {text}
    </button>
  );
}

export default SingleActionButton;
