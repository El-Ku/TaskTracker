import { useState } from "react";
import FormField from "./FormField";
import "../css/login.css";

const Login = ({ mode }) => {
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

      const response = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      const { result, message, token } = data;
      if (!response.ok) {
        setError(`${result} : ${message}` || "Something went wrong");
        return;
      }
      if (result == "success") {
        localStorage.setItem("userName", form.username);
        localStorage.setItem("token", token);
        window.location.href = "/profile"; // redirect after success
      }
    } catch (err) {
      setError(`Network error or server issue: ${err}`);
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
