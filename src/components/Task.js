import { FaCheckDouble, FaEdit, FaRegTrashAlt } from "react-icons/fa";

const Task = ({ task, index, deleteTask, getSingleTask, toggleComplete }) => {
  return (
    <div className={task.completed ? "task completed" : "task"}>
      <b>{index + 1}. </b>
      <div className="task-content">
        <span className="task-name">{task.name}</span>
      </div>
      <div className="task-icons">
        <FaCheckDouble color="green" onClick={() => toggleComplete(task)} />
        <FaEdit color="purple" onClick={() => getSingleTask(task)} />
        <FaRegTrashAlt color="red" onClick={() => deleteTask(task._id)} />
      </div>
    </div>
  );
};

export default Task;
