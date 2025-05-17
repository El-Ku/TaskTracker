import { useState } from "react";
import FormField from "./FormField";
import "../css/login.css";
import makeApiCall from "../services/makeApiCall";
import { useNavigate } from "react-router-dom";

const Login = ({ mode }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.username ||
      !form.password ||
      (mode === "register" && !form.confirmPassword)
    ) {
      return setError("Please fill in all fields.");
    }

    if (mode === "register" && form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const endpoint = mode === "login" ? "login" : "register";

      const data = await makeApiCall(
        `/api/auth/${endpoint}`,
        "POST",
        form,
        false
      );
      if (data.result === "success") {
        if (mode === "login") {
          localStorage.setItem("userName", form.username);
          localStorage.setItem("token", data.token);
          navigate("/profile");
        } else {
          alert("Registration successful! Please login.");
          window.location.href = "/";
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="login-container">
      <p className="login-description">
        {mode === "login"
          ? "Please enter your username and password to login."
          : "Please enter your details to register."}
      </p>

      <form onSubmit={handleSubmit}>
        <FormField
          type="text"
          name="username"
          value={form.username}
          handleChange={handleChange}
          required={true}
          label="Username"
        />
        <FormField
          type="password"
          name="password"
          value={form.password}
          handleChange={handleChange}
          required={true}
          label="Password"
        />
        {mode === "register" && (
          <FormField
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            handleChange={handleChange}
            required={true}
            label="Confirm Password"
          />
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      </form>
    </div>
  );
};

export default Login;
