"use client";

import React, { useEffect, useState, useCallback } from "react";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertItem {
  id: string;
  type: AlertType;
  message: string;
  duration?: number;
}

interface AdminAlertProps {
  alerts: AlertItem[];
  onDismiss: (id: string) => void;
}

const iconMap: Record<AlertType, string> = {
  success: "fas fa-check-circle",
  error: "fas fa-times-circle",
  warning: "fas fa-exclamation-triangle",
  info: "fas fa-info-circle",
};

const colorMap: Record<AlertType, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    icon: "text-green-500",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    icon: "text-red-500",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-800",
    icon: "text-yellow-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-800",
    icon: "text-blue-500",
  },
};

function AlertToast({
  alert,
  onDismiss,
}: {
  alert: AlertItem;
  onDismiss: (id: string) => void;
}) {
  const [exiting, setExiting] = useState(false);
  const colors = colorMap[alert.type];

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(alert.id), 300);
  }, [alert.id, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(dismiss, alert.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [alert.duration, dismiss]);

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-sm px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${
        colors.bg
      } ${colors.border} ${exiting ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"}`}
    >
      <i className={`${iconMap[alert.type]} ${colors.icon} text-lg mt-0.5`}></i>
      <p className={`flex-1 text-sm font-medium ${colors.text}`}>{alert.message}</p>
      <button
        onClick={dismiss}
        className={`${colors.icon} hover:opacity-70 transition-opacity`}
      >
        <i className="fas fa-times text-xs"></i>
      </button>
    </div>
  );
}

export default function AdminAlert({ alerts, onDismiss }: AdminAlertProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {alerts.map((alert) => (
        <AlertToast key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Hook for easy alert management
let alertCounter = 0;

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const addAlert = useCallback(
    (type: AlertType, message: string, duration?: number) => {
      const id = `alert-${++alertCounter}-${Date.now()}`;
      setAlerts((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { alerts, addAlert, dismissAlert };
}
