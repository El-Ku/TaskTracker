import { useEffect } from "react";
import { getUsers } from "../../services/adminApiCalls";
import { useAdmin } from "../../contexts/AdminContext";
import ActionButtons from "./ActionButtons";
import { tableSettings } from "./tableSettings";
import { flexRender } from "@tanstack/react-table";

function UserTable() {
  const { setUsers, error, setError, setOriginalUsers } = useAdmin();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        if (data) {
          setUsers(data);
          setOriginalUsers(data);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const table = tableSettings();

  return (
    <div>
      <ActionButtons />
      <div className="whole-table">
        <table className="task-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {/* Sorting indicators */}
                    {header.id !== "select" &&
                      ({
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ??
                        null)}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={`status-${row.original.role}`}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    onChange={() => {
                      if (row.id === "select") {
                        cell.handleCheckboxChange(row.id);
                      } else {
                        null;
                      }
                    }}
                    style={{ padding: "10px", border: "1px solid #ddd" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default UserTable;
