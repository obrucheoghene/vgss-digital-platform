"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme="system"
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:shadow-lg",
          success:
            "group-[.toaster]:bg-green-500 group-[.toaster]:text-white group-[.toaster]:border-green-600",
          error:
            "group-[.toaster]:bg-red-500 group-[.toaster]:text-white group-[.toaster]:border-red-600",
          warning:
            "group-[.toaster]:bg-yellow-500 group-[.toaster]:text-white group-[.toaster]:border-yellow-600",
          info: "group-[.toaster]:bg-blue-500 group-[.toaster]:text-white group-[.toaster]:border-blue-600",
        },
      }}
    />
  );
}
