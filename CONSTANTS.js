const TaskStatus = {
  PENDING: "pending",
  DONE: "done",
  PAUSED: "paused",
};

const ButtonText = {
  [TaskStatus.PENDING]: "⏳",
  [TaskStatus.DONE]: "✅",
  [TaskStatus.PAUSED]: "⏸️",
  delete: "❌",
  edit: "✍",
};

const CSS_PROP = {
  "--btn-font-size": "14px",
  "--btn-small-font-size": "12px",
};

export { TaskStatus, ButtonText, CSS_PROP };
