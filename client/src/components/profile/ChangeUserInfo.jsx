import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import makeApiCall from "../../services/makeApiCall";
import isEqual from "lodash/isEqual";
import { fullNameSchema, emailSchema } from "../../validation/zodSchemas";

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
      setOriginalInfo(profileInfo); // Update reference
    } catch (err) {
      setError("root", { message: err.message || "Something went wrong." });
    }
  };
  return (
    <div>
      <h2>User Settings</h2>

      <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Full name" {...register("fullName")} />
        {errors.fullName && <p className="error">{errors.fullName.message}</p>}
        <input type="text" placeholder="Email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}
        {errors.root && <p className="error">{errors.root.message}</p>}
        <button disabled={isSubmitting} className="update-btn" type="submit">
          Update Info
        </button>
      </form>
    </div>
  );
}

export default ChangeUserInfo;
