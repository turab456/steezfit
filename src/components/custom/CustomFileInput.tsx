import React, { useEffect, useRef, useState } from "react";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "className" | "value"
>;

interface CustomFileInputProps extends InputProps {
  className?: string;
  helperText?: string;
  selectedFileName?: string;
  isDraggingLabel?: string;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({
  className = "",
  helperText = "PNG, JPG, or GIF up to 10MB.",
  selectedFileName,
  isDraggingLabel = "Drop files to upload",
  multiple = false,
  disabled = false,
  accept = "image/*",
  onChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (typeof selectedFileName === "string") {
      setFileName(selectedFileName);
    }
  }, [selectedFileName]);

  const updateFileName = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setFileName("");
      return;
    }

    if (multiple && files.length > 1) {
      setFileName(`${files.length} files selected`);
      return;
    }

    setFileName(files[0].name);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFileName(event.target.files);
    onChange?.(event);
  };

  const triggerInput = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const dragEvents = {
    onDragEnter: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    onDragLeave: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragging(false);
      }
    },
    onDrop: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (disabled) return;

      setIsDragging(false);
      const files = event.dataTransfer.files;

      if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        Array.from(files).forEach((file) => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;

        const changeEvent = new Event("change", { bubbles: true });
        inputRef.current.dispatchEvent(changeEvent);
      }
    },
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
        multiple={multiple}
        accept={accept}
        {...rest}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={triggerInput}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            triggerInput();
          }
        }}
        {...dragEvents}
        className={`group flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-6 py-9 text-center transition ${
          disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-600"
            : "cursor-pointer border-gray-300 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        } ${isDragging ? "border-solid border-gray-900 dark:border-white" : ""}`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-600 transition group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16V8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 11L12 8L15 11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.99999 20H15.5C18.5376 20 21 17.5376 21 14.5C21 11.4624 18.5376 9 15.5 9C15.5 6.23858 13.2614 4 10.5 4C7.73858 4 5.49999 6.23858 5.49999 9C3.01471 9 0.999989 11.2386 0.999989 13.7239C0.999989 16.2091 2.79085 18 5.27557 18H7.99999"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {isDragging
              ? isDraggingLabel
              : fileName || "Click to upload or drag & drop"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold text-white transition group-hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:group-hover:bg-gray-100">
          Browse Files
        </div>
      </div>
    </div>
  );
};

export default CustomFileInput;
