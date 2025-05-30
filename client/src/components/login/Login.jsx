import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import makeApiCall from "../../services/makeApiCall";
import { useNavigate } from "react-router-dom";
import {
  passwordSchema,
  userNameSchema,
  emailSchema,
} from "../../validation/zodSchemas";
import InputField from "./InputField";

const getSchema = (mode) => {
  return z
    .object({
      username: userNameSchema,
      password: passwordSchema,
      ...(mode === "Register" && { email: emailSchema }),
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
      const endpoint = mode.toLowerCase();

      const data = await makeApiCall(
        `/api/auth/${endpoint}`,
        "POST",
        form,
        false
      );
      if (data.result === "success") {
        if (mode === "Login") {
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
    <div className="flex flex-col gap-4 w-full items-center">
      <p>
        {mode === "Login"
          ? "Please login to access your account"
          : "New here? Please enter your details to register."}
      </p>

      <form
        className="flex flex-col gap-2 border-2 border-gray-300 rounded-md p-4 min-w-80"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          register={register}
          errors={errors}
          type="text"
          placeholder="Username"
          property="username"
        />

        {mode === "Register" && (
          <InputField
            register={register}
            errors={errors}
            type="email"
            placeholder="Email"
            property="email"
          />
        )}
        <InputField
          register={register}
          errors={errors}
          type="password"
          placeholder="Password"
          property="password"
        />
        {mode === "Register" && (
          <InputField
            register={register}
            errors={errors}
            type="password"
            placeholder="Confirm Password"
            property="confirmPassword"
          />
        )}
        {errors.root && <p className="error">{errors.root.message}</p>}
        <button
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          disabled={isSubmitting}
          type="submit"
        >
          {mode}
        </button>
      </form>
    </div>
  );
};

export default Login;
