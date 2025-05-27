import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import makeApiCall from "../services/makeApiCall";
import { useNavigate } from "react-router-dom";
import {
  passwordSchema,
  userNameSchema,
  emailSchema,
} from "../validation/zodSchemas";

const getSchema = (mode) => {
  return z
    .object({
      username: userNameSchema,
      password: passwordSchema,
      ...(mode === "register" && { email: emailSchema }),
      confirmPassword: z.string().optional(), // add this so refine can access it
    })
    .refine(
      (data) =>
        data.confirmPassword ? data.password === data.confirmPassword : true,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    );
};

const Login = ({ mode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(getSchema(mode)),
  });

  const navigate = useNavigate();

  const onSubmit = async (form) => {
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
          localStorage.setItem("userRole", data.role);
          data.role === "user" ? navigate("/profile") : navigate("/admin");
        } else {
          alert("Registration successful! Please login.");
          window.location.href = "/";
        }
      }
    } catch (err) {
      setError("root", { message: err.message || "Something went wrong." });
    }
  };

  return (
    <div className="login-container">
      <p className="login-description">
        {mode === "login"
          ? "Please enter your username and password to login."
          : "Please enter your details to register."}
      </p>

      <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Username" {...register("username")} />
        {errors.username && <p className="error">{errors.username.message}</p>}
        {mode === "register" && (
          <input type="email" placeholder="Email" {...register("email")} />
        )}
        {errors.email && <p className="error">{errors.email.message}</p>}
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
        {mode === "register" && (
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
        )}
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}
        {errors.root && <p className="error">{errors.root.message}</p>}
        <button disabled={isSubmitting} type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Login;
