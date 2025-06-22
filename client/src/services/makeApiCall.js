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
    url: `/tasktracker${url}`,
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
    console.error("API call error from makeApiCall:", err);
    if (err.response) {
      const { message } = err.response.data || {};
      throw new Error(
        `Status ${err.response.status} : ${message || "Something went wrong"}`
      );
    } else if (err.request) {
      throw new Error(err.request.response || "No response from server");
    } else {
      throw new Error(err.message);
    }
  }
};

export default makeApiCall;
