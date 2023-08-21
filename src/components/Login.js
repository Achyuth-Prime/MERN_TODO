import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { URL } from "../App";

function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${URL}/api/users/login`, data);
      toast.success(res.data.message);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("token", res.data.token);
      window.location = "/tasks";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="user_page">
      <div className="user_form_container">
        <div className="user_form">
          <h2>Login to Your Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="input"
            />
            {error && <div className="error_msg">{error}</div>}
            <button className="--btn --btn-primary" type="submit">
              Log In
            </button>
          </form>
        </div>
        <div className="alternate">
          <h3>New Here ?</h3>
          <Link className="--btn --btn-secondary" to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
