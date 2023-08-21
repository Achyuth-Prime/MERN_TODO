import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { URL } from "../App";
import Task from "./Task";
import TaskForm from "./TaskForm";
import loadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const hooray = () => {
    setIsConfettiActive(true);
    setTimeout(() => {
      setIsConfettiActive(false);
    }, 3000);
  };

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [todos, setTodos] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [taskID, setTaskID] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    completed: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `${URL}/api/`,
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        const sortedTasks = res.data.tasks.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setTasks(sortedTasks);
      } else {
        throw new Error(res.data?.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error in getTasks:", error);
      toast.error(error.res.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.title === "") {
      setIsLoading(false);
      return toast.error("Input field cannot be empty");
    }
    try {
      const res = await axios({
        method: "post",
        url: `${URL}/api/`,
        data: formData,
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 201) {
        getTasks();
        toast.success("Task added successfully");
        setFormData({ ...formData, title: "" });
      } else {
        throw new Error(res.data.message || "An error occurred.");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const deleteTask = async (task) => {
    if (isEditing && taskID === task._id) {
      return toast.error("Please Complete Task Updation First");
    }
    setIsLoading(true);
    try {
      const res = await axios({
        method: "delete",
        url: `${URL}/api/${task._id}`,
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        getTasks();
        toast.success("Task Removed successfully");
        if (task.completed) hooray();
      } else {
        throw new Error(res.data.message || "An error occurred.");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const getTaskForEditing = async (task) => {
    setFormData({ title: task.title, completed: task.completed });
    setTaskID(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.title === "") {
      setIsLoading(false);
      return toast.error("Input field cannot be empty.");
    }
    try {
      const res = await axios({
        method: "put",
        url: `${URL}/api/${taskID}`,
        data: formData,
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        setFormData({ ...formData, title: "" });
        setIsEditing(false);
        getTasks();
        toast.success("Task Updated Successfully");
      } else {
        throw new Error(res.data.message || "An error occurred.");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const toggleComplete = async (task) => {
    if (isEditing && taskID === task._id) {
      return toast.error("Please Complete Task Updation First");
    }

    setIsLoading(true);
    const toggledTask = {
      completed: !task.completed,
    };

    try {
      const res = await axios({
        method: "put",
        url: `${URL}/api/${task._id}`,
        data: toggledTask,
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status === 200) {
        getTasks();
        if (toggledTask.completed) {
          toast.success("Task Completed successfully");
          hooray();
        } else {
          toast.warning("Task Added to Todo");
        }
      } else {
        throw new Error(res.data.message || "An error occurred.");
      }
    } catch (error) {
      setIsLoading(false);
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
    const cTaskSorted = cTask.sort(
      (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
    );
    setCompletedTasks(cTaskSorted);
    setTodos(incTasks);
  }, [tasks]);

  const handleLogout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location = "/";
    setIsLoading(false);
  };

  return (
    <div>
      {isConfettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
      )}
      <h4 className="--flex-center">{username}'s</h4>
      <h1 className="--flex-center">Task Manager</h1>
      {tasks.length > 0 && (
        <div className="--flex-center">
          <h4>
            <b>Your Total Tasks:</b> {tasks.length}
          </h4>
        </div>
      )}
      <button className="--btn --btn-danger" onClick={handleLogout}>
        Logout
      </button>
      <TaskForm
        title={formData.title}
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
                      getTaskForEditing={getTaskForEditing}
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
                      getTaskForEditing={getTaskForEditing}
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
