import React from "react";

interface LabelProps {
  label: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

export const CustomInputLabel: React.FC<LabelProps> = ({
  label,
  required = false,
  htmlFor,
  className = "",
}) => (
  <label
    htmlFor={htmlFor}
    className={className}
    style={{
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      fontFamily: "Outfit, sans-serif",
    }}
  >
    {label}
    {required && <span style={{ color: "#ef4444" }}> *</span>}
  </label>
);

interface CustomInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
  id?: string;
  name?: string;
  maxLength?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  className = "",
  label,
  required = false,
  id,
  name,
  maxLength,
}) => {
  return (
    <div>
      {label && (
        <CustomInputLabel label={label} required={required} htmlFor={id} />
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={className}
        maxLength={maxLength}
        style={{
          width: "100%",
          height: "44px",
          padding: type === "password" ? "12px 48px 12px 16px" : "12px 16px",
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
      />
    </div>
  );
};

export default CustomInput;
