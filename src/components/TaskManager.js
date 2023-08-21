import React from "react";
import TaskList from "./TaskList";

function TaskManager() {
  return (
    <div className="app">
      <div className="task-container">
        <TaskList />
      </div>
    </div>
  );
}

export default TaskManager;
