import { useState } from "react";
import FormField from "../FormField";
import makeApiCall from "../../services/makeApiCall";

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updatePassword = async () => {
    setError(null);
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (form.newPassword !== form.confirmPassword) {
      return setError("New passwords do not match.");
    }

    try {
      const data = await makeApiCall(
        "/api/profile/update-password",
        "POST",
        form
      );
      if (data.result === "success") {
        alert("Password updated successfully");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="compact-form">
      <h3>Change Password</h3>
      <form className="password-form">
        <FormField
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          handleChange={handleChange}
          placeholder="Enter your current password"
          required={true}
        />
        <FormField
          type="password"
          name="newPassword"
          value={form.newPassword}
          handleChange={handleChange}
          placeholder="Enter your new password"
          required={true}
        />
        <FormField
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          handleChange={handleChange}
          placeholder="Confirm your new password"
          required={true}
        />

        {error && <p className="error">{error}</p>}

        <button type="button" className="update-btn" onClick={updatePassword}>
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
