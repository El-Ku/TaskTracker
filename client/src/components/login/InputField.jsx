import React from "react";

function InputField({ register, errors, type, placeholder, property }) {
  return (
    <div>
      <input
        className="border-2 border-gray-300 rounded-md p-2 hover:border-gray-400 min-w-80"
        type={type}
        placeholder={placeholder}
        {...register(property)}
      />
      {errors[property] && (
        <p className="text-red-500 text-sm">{errors[property].message}</p>
      )}
    </div>
  );
}

export default InputField;
