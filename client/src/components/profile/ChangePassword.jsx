import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import makeApiCall from "../../services/makeApiCall";
import { passwordSchema } from "../../validation/zodSchemas";
import SingleFormField from "./SingleFormField";

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
      <h3 className="text-xl font-bold my-4">Change Password</h3>
      <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
        <SingleFormField
          type="password"
          label="Current password"
          register={register}
          errors={errors}
          property="currentPassword"
        />

        <SingleFormField
          type="password"
          label="New password"
          register={register}
          errors={errors}
          property="newPassword"
        />

        <SingleFormField
          type="password"
          label="Confirm password"
          register={register}
          errors={errors}
          property="confirmPassword"
        />

        {errors.root && (
          <p className="m-2 p-2 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm mx-4">
            {errors.root.message}
          </p>
        )}
        <button
          disabled={isSubmitting}
          className="mx-47 my-8 px-4 py-2 rounded-md max-w-60 bg-blue-500 text-white hover:bg-blue-600"
          type="submit"
        >
          {isSubmitting ? (
            <span className="ml-2">Updating...</span>
          ) : (
            <span className="ml-2">Update Password</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
