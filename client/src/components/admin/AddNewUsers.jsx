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
    { username: "aas", email: "w1212@fssd.com", password: "Elku1234" },
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
    <div className="add-new-users">
      <h2>Add New Users</h2>
      {newUsers.map((user, index) => (
        <div key={index} className="add-new-user-row">
          <input
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => handleChange(index, "username", e.target.value)}
            onBlur={(e) => handleBlur(userNameSchema, e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => handleChange(index, "email", e.target.value)}
            onBlur={(e) => handleBlur(emailSchema, e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => handleChange(index, "password", e.target.value)}
            onBlur={(e) => handleBlur(passwordSchema, e.target.value)}
          />
          <button onClick={addNewRow}> &#43;</button>
          <button onClick={() => deleteRow(index)}> &#8722;</button>
        </div>
      ))}
      <br />
      <button onClick={handleSubmit}>Create Users</button>
      <br />
      <br />
    </div>
  );
};

export default AddNewUsers;
