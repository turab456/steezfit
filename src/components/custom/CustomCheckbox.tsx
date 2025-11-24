import React from "react";

interface CustomCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  helperText,
  className = "",
  disabled = false,
  id,
  ...rest
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 ${
        disabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
      } ${className}`}
    >
      <span className="relative inline-flex">
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition checked:border-gray-900 checked:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/40 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100"
          {...rest}
        />
        <svg
          className="pointer-events-none absolute inset-0 m-auto h-3 w-3 text-white opacity-0 transition peer-checked:opacity-100"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 6L8.5 13.5L4 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {(label || helperText) && (
        <span className="flex flex-col text-sm">
          {label && (
            <span className="font-medium text-gray-900 ">
              {label}
            </span>
          )}
          {helperText && (
            <span className="text-gray-500 dark:text-gray-400">
              {helperText}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

export default CustomCheckbox;
