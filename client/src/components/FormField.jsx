function FormField({
  classname = "form-group",
  type = "text",
  label = "",
  name,
  value,
  placeholder = "",
  handleChange,
  required = false,
}) {
  return (
    <div className={classname}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
}

export default FormField;
