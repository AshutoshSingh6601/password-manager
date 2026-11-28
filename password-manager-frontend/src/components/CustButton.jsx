import React from "react";
import "../pages/Login/Login.css";

const CustButton = ({
  type = "button",
  label,
  className = "",
  onClick,
  disabled = false,
  loading = false,
  children
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`bg-[#2575fc] hover:bg-[#6a11cb] disabled:opacity-60 disabled:cursor-not-allowed p-[0.75rem] rounded-[6px] font-[600] text-[1rem] border-none text-amber-50 transition-[background,opacity] cursor-pointer duration-300 inline-flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
      type={type}
      disabled={isDisabled}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children || label}
    </button>
  );
};

export default CustButton;
