import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import makeApiCall from "../../services/makeApiCall";
import { passwordSchema } from "../../validation/zodSchemas";

const schema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match", // highlight the confirmPassword field
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (passwordForm) => {
    try {
      const data = await makeApiCall(
        `/api/profile/update-password`,
        "POST",
        passwordForm
      );
      if (data.result === "success") {
        alert("Password updated successfully");
      }
    } catch (err) {
      setError("root", { message: err.message || "Something went wrong." });
    }
  };

  return (
    <div className="compact-form">
      <h3>Change Password</h3>
      <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="password"
          placeholder="Current password"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="error">{errors.currentPassword.message}</p>
        )}
        <input
          type="password"
          placeholder="New password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="error">{errors.newPassword.message}</p>
        )}
        <input
          type="password"
          placeholder="Confirm password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}
        {errors.root && <p className="error">{errors.root.message}</p>}
        <button disabled={isSubmitting} type="submit">
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
