import { useEffect } from "react";
import { getUsers } from "../../services/adminApiCalls";
import { useAdmin } from "../../contexts/AdminContext";
import ActionButtons from "./ActionButtons";
import { tableSettings } from "./tableSettings";
import { flexRender } from "@tanstack/react-table";
import SyncToDBButton from "./SyncToDBButton";

function UserTable() {
  const {
    users,
    setUsers,
    error,
    setError,
    setOriginalUsers,
    newUsersAdded,
    setNewUsersAdded,
  } = useAdmin();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        if (data) {
          setUsers(data);
          setOriginalUsers(data);
        }
        setError(null);
        setNewUsersAdded(false);
      } catch (err) {
        setError(err.message);
      }
    };
    if (newUsersAdded) fetchUsers();
  }, [newUsersAdded]);

  const table = tableSettings();

  return (
    <div className="p-6 max-w-6xl min-w-150 mx-auto font-sans w-full">
      <ActionButtons />
      <p className="text-lg mb-4">
        {users.length > 0 ? (
          <p>
            You have a total of <strong>{users.length} </strong>users
          </p>
        ) : (
          "You have no other users on the systemyet"
        )}
      </p>
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
                  row.original.role === "admin"
                    ? "bg-red-300"
                    : row.original.role === "user"
                    ? "bg-green-100"
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

export default UserTable;
