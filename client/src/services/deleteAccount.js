const deleteAccount = async () => {
  try {
    const response = await fetch("/api/users/deleteAccount", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const { result, message } = data;
      alert(`${result} : ${message}` || "Something went wrong");
      return;
    }

    alert("Account deleted successfully");
    localStorage.removeItem("userName");
    window.location.href = "/"; // redirect after success
  } catch (err) {
    console.log(err);
    alert("Network error or server issue");
  }
};

export default deleteAccount;
