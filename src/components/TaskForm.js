const TaskForm = ({
  createTask,
  title,
  handleInputChange,
  isEditing,
  updateTask,
}) => {
  return (
    <form className="task-form" onSubmit={isEditing ? updateTask : createTask}>
      <input
        type="text"
        placeholder="Add a Task"
        name="title"
        value={title}
        onChange={handleInputChange}
      />
      <button type="submit">{isEditing ? "Update" : "Add"}</button>
    </form>
  );
};

export default TaskForm;
