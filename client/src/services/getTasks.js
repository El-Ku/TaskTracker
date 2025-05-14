const getTasks = async () => {
  const token = localStorage.getItem("token");
  console.log(token);

  try {
    const response = await fetch("/api/tasks/allTasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const { result, message, payload } = data;
    if (!response.ok) {
      alert(`${result} : ${message}` || "Something went wrong");
      return;
    } else {
      console.log(`${result} : ${message}`);
    }
    return data.payload; // Assuming the API returns tasks in this format
  } catch (err) {
    console.log(err);
    alert("Network error or server issue");
  }
};

export default getTasks;
