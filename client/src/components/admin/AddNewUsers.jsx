import { useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import {
  userNameSchema,
  emailSchema,
  passwordSchema,
} from "../../validation/zodSchemas";
import { addUsers } from "../../services/adminApiCalls";

const AddNewUsers = () => {
  const { setError, setNewUsersAdded } = useAdmin();

  const [newUsers, setNewUsers] = useState([
    { username: "", email: "", password: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updatedUsers = [...newUsers];
    updatedUsers[index][field] = value;
    setNewUsers(updatedUsers);
  };

  const addNewRow = () => {
    setNewUsers([...newUsers, { username: "", email: "", password: "" }]);
  };

  const deleteRow = (index) => {
    const updatedUsers = [...newUsers];
    updatedUsers.splice(index, 1);
    setNewUsers(updatedUsers);
  };

  const handleSubmit = async () => {
    try {
      await addUsers(newUsers);
      setError(null);
      setNewUsers([{ username: "", email: "", password: "" }]); // Reset to initial state
      alert("Users added successfully");
      setNewUsersAdded(true);
    } catch (err) {
      setError(err.message || "Failed to add user");
      setNewUsersAdded(false);
    }
  };

  const handleBlur = (schema, value) => {
    const result = schema.safeParse(value);
    if (result.success) {
      setError(null);
    } else {
      setError(result.error.issues[0].message);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto border-2 border-gray-300 rounded-md pt-4">
      <h2 className="text-2xl font-bold mb-6">Add New Users</h2>
      {newUsers.map((user, index) => (
        <div
          key={index}
          className="flex flex-row gap-1 text-sm sm:gap-4 ml-2 mr-2"
        >
          <input
            className="border-2 border-gray-300 rounded-md h-8 p-1 hover:border-gray-400 w-full"
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => handleChange(index, "username", e.target.value)}
            onBlur={(e) => handleBlur(userNameSchema, e.target.value)}
          />
          <input
            className="border-2 border-gray-300 rounded-md h-8 p-1 hover:border-gray-400 w-full"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => handleChange(index, "email", e.target.value)}
            onBlur={(e) => handleBlur(emailSchema, e.target.value)}
          />
          <input
            className="border-2 border-gray-300 rounded-md h-8 p-2 hover:border-gray-400 w-full"
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => handleChange(index, "password", e.target.value)}
            onBlur={(e) => handleBlur(passwordSchema, e.target.value)}
          />
          <div className="flex flex-row">
            <button
              className="border-2 h-8 px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600"
              onClick={addNewRow}
            >
              +
            </button>
            <button
              className="border-2 h-8 px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
              onClick={() => deleteRow(index)}
            >
              {" "}
              &#8722;
            </button>
          </div>
        </div>
      ))}
      <br />
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Create Users
      </button>
      <br />
      <br />
    </div>
  );
};

export default AddNewUsers;
