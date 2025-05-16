const makeApiCall = async (url, method, body) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(url, {
      ...(method && { method }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    const data = await response.json();
    if (!response.ok) {
      const { result, message } = data;
      throw new Error(`${result} : ${message}` || "Something went wrong");
    }
    return data;
  } catch (err) {
    console.error("Error on API call:", err);
    alert("Error on API call:", err);
  }
};

export default makeApiCall;
