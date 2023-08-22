import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { URL } from "../App";
import loadingImg from "../assets/loader.gif";

function Register() {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${URL}/api/users/register`, data);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user_page">
      <div className="user_form_container">
        <div className="user_form">
          <h2>Create Your Account</h2>
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
            {isLoading && (
              <div className="--flex-center">
                <img src={loadingImg} className="gif" alt="Loading" />
              </div>
            )}
            <button className="--btn --btn-primary" type="submit">
              Register
            </button>
          </form>
        </div>
        <div className="alternate">
          <h3>Have an account already?</h3>
          <Link className="--btn --btn-secondary" to="/">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
