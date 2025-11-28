import React, { useEffect } from "react";
import { useLenisInstance } from "../layout/SmoothScrollProvider";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  allowBackdropClose?: boolean;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
}

const SIZE_CLASS_MAP: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-none",
};

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  children,
  size = "lg",
  showCloseButton = true,
  allowBackdropClose = true,
  className = "",
  contentClassName = "",
  overlayClassName = "",
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Store original values
      const { body, documentElement } = document;
      const originalBodyOverflow = body.style.overflow;
      const originalHtmlOverflow = documentElement.style.overflow;
      const originalBodyPadding = body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
      
      // Apply scroll lock
      body.style.overflow = "hidden";
      documentElement.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.removeEventListener("keydown", handleEsc);
        // Restore original values
        body.style.overflow = originalBodyOverflow || "";
        documentElement.style.overflow = originalHtmlOverflow || "";
        body.style.paddingRight = originalBodyPadding || "";
      };
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const lenisInstance = useLenisInstance();

  useEffect(() => {
    if (!lenisInstance) return;
    
    if (isOpen) {
      lenisInstance.stop();
    } else {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        lenisInstance.start();
      }, 50);
      return () => clearTimeout(timer);
    }
    
    return () => {
      lenisInstance.start();
    };
  }, [isOpen, lenisInstance]);

  if (!isOpen) {
    return null;
  }

  const widthClasses =
    size === "full"
      ? "w-screen h-screen"
      : `w-full ${SIZE_CLASS_MAP[size]} mx-4`;

  const roundingClass = size === "full" ? "rounded-none" : "rounded-3xl";
  const heightClass = size === "full" ? "h-full" : "max-h-[90vh]";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className={`absolute inset-0 z-10 bg-gray-900/50 ${overlayClassName}`}
        onClick={() => {
          if (allowBackdropClose) {
            onClose();
          }
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 flex flex-col overflow-hidden bg-white text-gray-900 shadow-2xl ${roundingClass} ${widthClasses} ${className}`}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}

        <div
          className={`flex-1 overflow-y-auto custom-scrollbar p-6 ${heightClass} ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
