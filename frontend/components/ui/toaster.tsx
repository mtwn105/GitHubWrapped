"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "loading";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToasterContextType {
  toast: (message: string, type: ToastType) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error("useToast must be used within a ToasterProvider");
  }
  return context;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    if (type !== "loading") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToasterContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg transition-all",
              {
                "bg-green-500/90 backdrop-blur": toast.type === "success",
                "bg-red-500/90 backdrop-blur": toast.type === "error",
                "bg-white/10 backdrop-blur animate-pulse":
                  toast.type === "loading",
              }
            )}
          >
            <span>{toast.message}</span>
            {toast.type !== "loading" && (
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 rounded-full p-1 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  );
}
