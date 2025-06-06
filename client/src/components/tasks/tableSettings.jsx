import EditableCell from "./EditableCell";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useTasks } from "../../contexts/TasksContext";
import { useState } from "react";
import { schemaDesc, schemaStatus } from "../../validation/zodSchemas";

export const tableSettings = () => {
  // State for data and sorting
  const [sorting, setSorting] = useState([]);
  const {
    tasks,
    setTasks,
    selectedRows,
    setSelectedRows,
    selectedSelectAll,
    setSelectedSelectAll,
  } = useTasks();

  const headerNames = ["Select", "Id", "Description", "Created @", "Status"];

  // Define table columns
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.options.meta.selectedSelectAll}
          onChange={table.options.meta.handleSelectAll}
          aria-label="Select all tasks"
          className="cb-column"
        />
      ),
      cell: ({ row, table }) => (
        <input
          type="checkbox"
          checked={table.options.meta.selectedRows.includes(row.id)}
          onChange={() => table.options.meta.handleCheckboxChange(row.id)}
          aria-label={`Select task ${row.id}`}
          className="cb-column"
        />
      ),
      enableSorting: false,
      size: 40,
    },
    {
      accessorKey: "desc",
      header: headerNames[2],
      cell: ({ row, getValue, column }) => {
        return (
          <EditableCell
            value={getValue()}
            rowId={row.id}
            rowIndex={row.index} // Pass the table's row index (for logging)
            columnId={column.id}
            updateData={table.options.meta.updateData}
            validationSchema={schemaDesc}
          />
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: headerNames[3],
      cell: (info) => formatDate(info.getValue()),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: headerNames[4],
      cell: ({ row, getValue, column }) => {
        return (
          <EditableCell
            value={getValue()}
            rowId={row.id}
            rowIndex={row.index}
            columnId={column.id}
            updateData={table.options.meta.updateData}
            validationSchema={schemaStatus}
          />
        );
      },
      enableSorting: true,
    },
  ];

  // Function to update data
  const updateData = (columnId, rowIndex, value) => {
    setTasks((prev) =>
      prev.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const handleSelectAll = () => {
    const currentPageRowIds = table.getRowModel().rows.map((row) => row.id);
    if (selectedSelectAll) {
      // Deselect all rows on the current page
      setSelectedRows((prev) =>
        prev.filter((id) => !currentPageRowIds.includes(id))
      );
      setSelectedSelectAll(false);
    } else {
      // Select all rows on the current page
      setSelectedRows((prev) => [
        ...new Set([...prev, ...currentPageRowIds]), // Avoid duplicates
      ]);
      setSelectedSelectAll(true);
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (rowId) => {
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  // Initialize TanStack Table
  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData,
      selectedRows,
      selectedSelectAll,
      handleSelectAll,
      handleCheckboxChange,
    },
  });
  return table;
};

const formatDate = (date) => {
  {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
};
