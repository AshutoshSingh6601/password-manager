import React from "react";

const CustInput = ({
  label,
  type = "text",
  value = "",
  onChange,
  name,
  className = "",
  placeholder = "",
  required = false,
  disabled = false,
  autoComplete
}) => {
  const inputId = name || label?.toLowerCase().replace(/\s+/g, "-") || "input";
  const formattedPlaceholder = placeholder
    ? placeholder.toLowerCase().startsWith("enter")
      ? placeholder
      : `Enter your ${placeholder}`
    : label
    ? `Enter your ${label}`
    : "";

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="font-[500] text-[#333]">
          {label}
          {required && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      <input
        className="p-[0.6rem] rounded-[8px] border border-gray-300 focus:border-[#2575fc] outline-none transition-[border-color] duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={formattedPlaceholder}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default CustInput;
