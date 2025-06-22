import React from "react";

function SingleFormField({ type, label, register, errors, property }) {
  const propName = label.toLowerCase().replace(" ", "");
  return (
    <div>
      <div className="flex flex-row gap-4">
        <label className="text-lg m-2 min-w-40" htmlFor={label}>
          {label}
        </label>
        <input
          type={type}
          placeholder={label}
          {...register(property)}
          className="border-2 border-gray-300 rounded-md h-10 p-2 max-w-xs hover:border-gray-400"
        />
      </div>
      {errors[property] && (
        <p className="m-2 p-2 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm mx-4">
          {errors[property].message}
        </p>
      )}
    </div>
  );
}

export default SingleFormField;
