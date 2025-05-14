const updatePassword = async (form) => {
  const { newpassword, confirmPassword } = form;
  if (!newpassword || !confirmPassword) {
    return alert("Please fill in all fields.");
  }

  if (newpassword !== confirmPassword) {
    return alert("Passwords do not match.");
  }

  try {
    const response = await fetch("/api/users/updatePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ form }),
    });

    const data = await response.json();

    if (!response.ok) {
      const { result, message } = data;
      alert(`${result} : ${message}` || "Something went wrong");
      return;
    }

    alert("Password updated successfully");
  } catch (err) {
    console.log(err);
    alert("Network error or server issue");
  }
};

export default updatePassword;
