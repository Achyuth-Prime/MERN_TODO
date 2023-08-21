import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import MainRouter from "./components/MainRouter";
import TaskManager from "./components/TaskManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainRouter />}>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<TaskManager />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={1700} />
    </>
  );
}

export default App;
