import { useEffect } from "react";
import { getTasks } from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";
import ActionButtons from "./ActionButtons";
import SyncToDBButton from "./SyncToDBButton";
import { tableSettings } from "./tableSettings";
import { flexRender } from "@tanstack/react-table";

function TaskTable() {
  const { setTasks, error, setError, setOriginalTasks, setTaskCount } =
    useTasks();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        if (data) {
          setTasks(data);
          setTaskCount(data.length);
          setOriginalTasks(data);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);

  const table = tableSettings();

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans w-full">
      <ActionButtons />
      <div className="flex flex-col items-center">
        <table className="w-full border-2 border-gray-200 rounded-lg shadow-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 bg-gray-50 border-b-2 border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200
                    ${header.id === "select" ? "w-12 text-center" : ""}`}
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {/* Sorting indicators */}
                    {header.id !== "select" && (
                      <span className="ml-1 inline-block align-middle">
                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                          ? " 🔽"
                          : null}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200
                ${
                  row.original.status === "pending"
                    ? "bg-yellow-200"
                    : row.original.status === "done"
                    ? "bg-green-200"
                    : row.original.status === "paused"
                    ? "bg-gray-300"
                    : ""
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 text-sm text-gray-600 border-r border-gray-200 last:border-r-0
                      ${cell.column.id === "select" ? "text-center" : ""}`}
                    onChange={() => {
                      if (row.id === "select") {
                        cell.handleCheckboxChange(row.id);
                      } else {
                        null;
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && (
        <p className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          {error}
        </p>
      )}
      <SyncToDBButton />
    </div>
  );
}

export default TaskTable;
