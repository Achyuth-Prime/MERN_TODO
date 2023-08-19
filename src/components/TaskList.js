import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { URL } from "../App";
import Task from "./Task";
import TaskForm from "./TaskForm";
import loadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });
  const { name } = formData;

  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const hooray = () => {
    setIsConfettiActive(true);
    setTimeout(() => {
      setIsConfettiActive(false);
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${URL}/api/tasks`);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData);
      getTasks();
      toast.success("Task added successfully");
      setFormData({ ...formData, name: "" });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
      toast.success("Task Removed successfully");
      hooray();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: task.completed });
    setTaskID(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty.");
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData);
      setFormData({ ...formData, name: "" });
      setIsEditing(false);
      getTasks();
      toast.success("Task Updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: !task.completed,
    };
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      getTasks();
      if (newFormData.completed) {
        toast.success("Task Completed successfully");
        hooray();
      } else {
        toast.warning("Task Added to Todo");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const cTask = [];
    const incTasks = [];
    tasks.forEach((task) => {
      if (task.completed) cTask.push(task);
      else incTasks.push(task);
    });
    setCompletedTasks(cTask);
    setTodos(incTasks);
  }, [tasks]);

  return (
    <div>
      {isConfettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
      )}
      <h1 className="--flex-center">Task Manager</h1>
      {tasks.length > 0 && (
        <div className="--flex-center">
          <h4>
            <b>Total Tasks:</b> {tasks.length}
          </h4>
        </div>
      )}
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {isLoading ? (
        <div className="--flex-center">
          <img src={loadingImg} alt="Loading" />
        </div>
      ) : !isLoading && tasks.length === 0 ? (
        <h4 className="--py --flex-center">No Tasks Added</h4>
      ) : (
        <>
          {todos.length > 0 && (
            <>
              <div className="--flex-between">
                <p>
                  <b>Todo:</b> {todos.length}
                </p>
              </div>
              <hr />
              <div className="scrollable">
                {todos.map((task, index) => {
                  return (
                    <Task
                      key={task._id}
                      task={task}
                      index={index}
                      deleteTask={deleteTask}
                      getSingleTask={getSingleTask}
                      toggleComplete={toggleComplete}
                    />
                  );
                })}
              </div>
            </>
          )}
          <br />
          {completedTasks.length > 0 && (
            <>
              <div className="--flex-between">
                <p>
                  <b>Completed Tasks:</b> {completedTasks.length}
                </p>
              </div>
              <hr />
              <div className="scrollable">
                {completedTasks.map((task, index) => {
                  return (
                    <Task
                      key={task._id}
                      task={task}
                      index={index}
                      deleteTask={deleteTask}
                      getSingleTask={getSingleTask}
                      toggleComplete={toggleComplete}
                    />
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
