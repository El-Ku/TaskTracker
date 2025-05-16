import { useState, useEffect } from "react";
import makeApiCall from "../../services/makeApiCall";
import FormField from "../FormField";

function ChangeUserInfo() {
  const [formInfo, setFormInfo] = useState({
    fullName: "",
    email: "",
  });
  const [originalInfo, setOriginalInfo] = useState({});
  const [error, setError] = useState(null);
  const [formChangedFlag, setFormChangedFlag] = useState(false);

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
    if (formInfo[e.target.name] !== originalInfo[e.target.name]) {
      setFormChangedFlag(true);
    }
  };

  const updateUserInfo = async () => {
    //check if both formInfo and originalInfo are the same
    if (!formChangedFlag) {
      return setError("No changes were made to user info");
    }
    console.log(formInfo);
    try {
      const data = await makeApiCall(
        "/api/profile/user-info",
        "PATCH",
        formInfo
      );
      alert("User info updated successfully");
      setError("");
      setFormChangedFlag(false);
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
