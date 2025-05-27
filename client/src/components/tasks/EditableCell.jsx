import { useTasks } from "../../contexts/TasksContext";
import { useState } from "react";

function EditableCell({
  value,
  rowId,
  columnId,
  rowIndex,
  updateData,
  validationSchema,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(value);

  const { setError } = useTasks();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setCellValue(e.target.value);
  };

  const handleBlur = () => {
    const result = validationSchema.safeParse(cellValue);
    if (!result.success) {
      // Set error message from Zod
      setError(result.error.errors[0].message);
      return;
    }
    setIsEditing(false);
    updateData(columnId, rowIndex, cellValue);
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          className="editable-input-task-table"
          type="text"
          value={cellValue}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          style={{ width: "80%", padding: "5px" }}
        />
      ) : (
        <span>{cellValue}</span>
      )}
    </div>
  );
}

export default EditableCell;
