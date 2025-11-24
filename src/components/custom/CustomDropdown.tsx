import React from "react";
import { CustomInputLabel } from "./CustomInput";

type Option = {
  label: string;
  value: string;
};

interface CustomDropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  options?: Option[];
  helperText?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  required = false,
  options,
  children,
  className = "",
  disabled = false,
  id,
  helperText,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <CustomInputLabel label={label} required={required} htmlFor={id} />
      )}
      <select
        id={id}
        disabled={disabled}
        className={className}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          fontSize: "14px",
          fontFamily: "Outfit, sans-serif",
          backgroundColor: disabled ? "#f9fafb" : "#ffffff",
          color: "#374151",
          outline: "none",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#000000";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#d1d5db";
        }}
        {...rest}
      >
        {options
          ? options.map((option) => (
              <option key={option.value || option.label} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      {helperText && (
        <p style={{ marginTop: "4px", fontSize: "12px", color: "#6b7280" }}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default CustomDropdown;
