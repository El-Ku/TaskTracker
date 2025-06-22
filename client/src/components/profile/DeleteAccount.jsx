import { useState } from "react";
import makeApiCall from "../../services/makeApiCall";

function DeleteAccount() {
  const [error, setError] = useState(null);
  const deleteAccount = async () => {
    try {
      await makeApiCall("/api/profile/user-info", "DELETE", null);
      localStorage.removeItem("userName");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="max-w-40 my-12 px-5 py-2 ext-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        onClick={deleteAccount}
      >
        Delete Account
      </button>
      {error && (
        <p className="m-2 p-2 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm mx-4">
          {error}
        </p>
      )}
    </div>
  );
}

export default DeleteAccount;
