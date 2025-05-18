const makeApiCall = async (url, method, body, useToken = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (useToken) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, {
      ...(method && { method }),
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });
    const data = await response.json();
    // Check if the response is ok (status in the range 200-299)
    // If not, throw an error with the message from the response
    // or a default message
    if (!response.ok) {
      const { result, message } = data;
      throw new Error(`${result} : ${message}` || "Something went wrong");
    }
    return data;
  } catch (err) {
    throw err; // Rethrow the error to be handled by the calling function
  }
};

export default makeApiCall;
