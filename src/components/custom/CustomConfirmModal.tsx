import React from "react";
import CustomModal from "./CustomModal";
import CustomButton from "./CustomButton";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      allowBackdropClose={!isProcessing}
      contentClassName="p-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <CustomButton
            fullWidth={false}
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            size="sm"
          >
            {cancelText}
          </CustomButton>
          <CustomButton
            fullWidth={false}
            onClick={onConfirm}
            disabled={isProcessing}
            size="sm"
            style={{ backgroundColor: "#dc2626" }}
          >
            {isProcessing ? "Please wait..." : confirmText}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmModal;
