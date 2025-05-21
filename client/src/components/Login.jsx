import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import makeApiCall from "../services/makeApiCall";
import { useNavigate } from "react-router-dom";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password must be at most 32 characters long")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/[0-9]/, "Must include at least one number");

const schema = z
  .object({
    username: z.string().min(3, "User name must be at least 3 characters"),
    password: passwordSchema,
  })
  .refine(
    (data) =>
      data.confirmPassword ? data.password === data.confirmPassword : true,
    {
      message: "Passwords do not match", // highlight the confirmPassword field
      path: ["confirmPassword"],
    }
  );

const Login = ({ mode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
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
          navigate("/profile");
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
