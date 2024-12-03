"use client";
import { useState, useEffect } from "react";

let toastHandler;

export const Toast = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    toastHandler = {
      addToast: (toast) => {
        const id = Date.now();
        setToasts((current) => [...current, { ...toast, id }]);
        setTimeout(() => removeToast(id), 3000); // Auto-remove after 3s
      },
    };
  }, []);

  return (
    <div className="fixed top-5 right-5 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow-lg ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

// Export the handler to use in other files
export const toast = {
  success: (message) => toastHandler.addToast({ type: "success", message }),
  error: (message) => toastHandler.addToast({ type: "error", message }),
  info: (message) => toastHandler.addToast({ type: "info", message }),
};
