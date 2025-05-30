import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import makeApiCall from "../../services/makeApiCall";
import isEqual from "lodash/isEqual";
import { fullNameSchema, emailSchema } from "../../validation/zodSchemas";
import SingleFormField from "./SingleFormField";

const schema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
});

function ChangeUserInfo() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [originalInfo, setOriginalInfo] = useState(null);

  useEffect(() => {
    // Fetch user info initially
    const fetchUser = async () => {
      try {
        const data = await makeApiCall("/api/profile/user-info", null, null);
        const userInfo = data.payload;
        setOriginalInfo(userInfo);
        Object.entries(userInfo).forEach(([key, value]) => {
          setValue(key, value);
        });
      } catch (err) {
        setError("root", { message: "Failed to load user info." });
      }
    };
    fetchUser();
  }, []);

  const onSubmit = async (profileInfo) => {
    if (isEqual(profileInfo, originalInfo)) {
      setError("root", {
        message: "No changes detected.",
      });
      return;
    }
    try {
      await makeApiCall("/api/profile/user-info", "PATCH", profileInfo);
      alert("User info updated successfully");
      setError("");
      setOriginalInfo(profileInfo);
    } catch (err) {
      setError("root", { message: err.message || "Something went wrong." });
    }
  };
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl underline font-bold my-4">User Settings</h2>

      <form className="gap-4" onSubmit={handleSubmit(onSubmit)}>
        <SingleFormField
          type="text"
          label="Full Name"
          register={register}
          errors={errors}
          property="fullName"
        />
        <SingleFormField
          type="email"
          label="Email"
          register={register}
          errors={errors}
          property="email"
        />

        {errors.root && (
          <p className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm mx-4">
            {errors.root.message}
          </p>
        )}
        <button
          disabled={isSubmitting}
          className="mx-50 my-8 px-4 py-2 rounded-md max-w-40 bg-blue-500 text-white hover:bg-blue-600"
          type="submit"
        >
          {isSubmitting ? (
            <span className="ml-2">Updating...</span>
          ) : (
            <span className="ml-2">Update Info</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChangeUserInfo;
