import { useState, useEffect } from "react";
import makeApiCall from "../../services/makeApiCall";
import FormField from "../FormField";
import isEqual from "lodash/isEqual";

function ChangeUserInfo() {
  const [formInfo, setFormInfo] = useState({
    fullName: "",
    email: "",
  });
  const [originalInfo, setOriginalInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user info initially
    const fetchUser = async () => {
      const data = await makeApiCall("/api/profile/user-info", null, null);
      const userInfo = data.payload;
      setOriginalInfo(userInfo);
      setFormInfo(userInfo);
    };
    fetchUser();
  }, []);

  //once its set true, it will not be set to false again
  //this results in a false flag when the user tries to update one field
  // and then go back to the original value
  const handleChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
  };

  const updateUserInfo = async () => {
    //send to server only if the user has changed atleat one field
    if (isEqual(formInfo, originalInfo)) {
      return setError("No changes were made to user info");
    }
    try {
      await makeApiCall("/api/profile/user-info", "PATCH", formInfo);
      alert("User info updated successfully");
      setError("");
      setOriginalInfo(formInfo);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <h2>User Settings</h2>

      <FormField
        type="text"
        name="fullName"
        value={formInfo.fullName}
        handleChange={handleChange}
        required={true}
        label="Full Name"
      />
      <FormField
        type="email"
        name="email"
        value={formInfo.email}
        handleChange={handleChange}
        required={true}
        label="Email"
      />
      <button className="update-btn" type="button" onClick={updateUserInfo}>
        Update Info
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default ChangeUserInfo;
