import axios from "axios";

const makeApiCall = async (
  url,
  method = "GET",
  body = null,
  useToken = true
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (useToken) {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    url: `${import.meta.env.VITE_BASE_URL}${url}`,
    headers,
  };

  // Conditionally add `data` only if `body` exists
  if (body) {
    config.data = body;
  }

  try {
    const response = await axios(config);
    return response.data; // already parsed JSON
  } catch (err) {
    // Axios wraps errors with `response`, `request`, or `message`
    if (err.response) {
      const { result, message } = err.response.data || {};
      throw new Error(
        `${result || err.response.status} : ${
          message || "Something went wrong"
        }`
      );
    } else if (err.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error(err.message);
    }
  }
};

export default makeApiCall;

/* const makeApiCall = async (url, method, body, useToken = true) => {
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
 */
