"use client";
import React from "react";
import { X } from "lucide-react";
import Button from "./Button";

export function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={() => {
          onClose();
        }}
      ></div>
      <div className="relative z-10 w-full max-w-2xl shadow-xl bg-white p-4 rounded-lg mx-auto">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Button
            variant="danger"
            onClick={() => {
              onClose();
            }}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
