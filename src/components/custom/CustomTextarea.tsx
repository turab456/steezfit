import React from "react";
import { CustomInputLabel } from "./CustomInput";

interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  rows?: number;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  label,
  required = false,
  rows = 4,
  id,
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <CustomInputLabel label={label} required={required} htmlFor={id} />
      )}
      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        className={className}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          fontSize: "14px",
          fontFamily: "Outfit, sans-serif",
          backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
          color: "#374151",
          outline: "none",
          resize: "vertical",
          minHeight: `${rows * 24}px`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#000000";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#d1d5db";
        }}
        {...rest}
      />
    </div>
  );
};

export default CustomTextarea;
