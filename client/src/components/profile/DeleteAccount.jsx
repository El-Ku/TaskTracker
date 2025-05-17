import { useState } from "react";
import makeApiCall from "../../services/makeApiCall";

function DeleteAccount() {
  const [error, setError] = useState(null);
  const deleteAccount = async () => {
    try {
      console.log("Deleting account...");
      await makeApiCall("/api/profile/user-info", "DELETE", null);
      localStorage.removeItem("userName");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <button className="delete-btn" onClick={deleteAccount}>
        Delete Account
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default DeleteAccount;
