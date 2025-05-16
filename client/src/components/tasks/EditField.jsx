import { useState } from "react";
import { useTasks } from "../../contexts/TasksContext";
import { updateFieldCallApi } from "../../services/taskApiCalls";

{
  /* Make a field on the table editable on click.
   * When the edit action button is clicked, it becomes an input field.
   * When the user presses Enter, the value is updated in the database and the table.
   * When the user presses Escape, the input field is closed without saving.
   */
}
function EditField({ task, propertyToUpdate }) {
  const { setTasks, editTaskId, setEditTaskId, editValue, setEditValue } =
    useTasks();

  return (
    <td>
      {editTaskId === task._id ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              if (!editValue.trim()) {
                alert("Task description cannot be empty");
                return;
              }

              const data = await updateFieldCallApi(task._id, {
                [propertyToUpdate]: editValue,
              });
              if (data.result === "success") {
                setTasks((prev) =>
                  prev.map((t) =>
                    t._id === task._id
                      ? { ...t, [propertyToUpdate]: editValue }
                      : t
                  )
                );
                setEditTaskId(null); // exit edit mode
              }
              return;
            }
            if (e.key === "Escape") {
              setEditTaskId(null);
            }
          }}
          autoFocus
        />
      ) : (
        task[propertyToUpdate]
      )}
    </td>
  );
}

export default EditField;
