"use client";

import React, { useEffect, useRef } from "react";

export type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const variantStyles: Record<
  ConfirmVariant,
  { icon: string; iconBg: string; iconColor: string; btnBg: string; btnHover: string }
> = {
  danger: {
    icon: "fas fa-trash-alt",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    btnBg: "bg-red-600",
    btnHover: "hover:bg-red-700",
  },
  warning: {
    icon: "fas fa-exclamation-triangle",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    btnBg: "bg-yellow-600",
    btnHover: "hover:bg-yellow-700",
  },
  info: {
    icon: "fas fa-info-circle",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    btnBg: "bg-blue-600",
    btnHover: "hover:bg-blue-700",
  },
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const style = variantStyles[variant];

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in">
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center`}
            >
              <i className={`${style.icon} ${style.iconColor} text-xl`}></i>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
            {title}
          </h3>
          <div className="text-sm text-gray-600 text-center">{message}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white transition disabled:opacity-50 ${style.btnBg} ${style.btnHover}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <i className="fas fa-spinner fa-spin text-xs"></i>
                Processing...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
