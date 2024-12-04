import React from "react";

export default function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  onClick,
  disabled
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`
      rounded-lg py-2 px-8 text-white font-[500] duration-300 transition-all disabled:cursor-not-allowed disabled:opacity-85 
      ${
        variant === "primary"
          ? "bg-gradient-to-tl from-primary to-secondary bg-[length:135%_135%] hover:bg-[length:102%_102%]"
          : ""
      } 
      ${
        variant === "secondary"
          ? "bg-gradient-to-tl from-[#333333] to-gray-500 bg-[length:135%_135%] hover:bg-[length:102%_102%]"
          : ""
      } 
      ${
        variant === "success"
          ? "bg-gradient-to-tl from-[#333333] to-green-500 bg-[length:135%_135%] hover:bg-[length:110%_110%]"
          : ""
      } 
      ${
        variant === "danger"
          ? "bg-gradient-to-tl from-[#333333] to-red-500 bg-[length:135%_135%] hover:bg-[length:110%_110%]"
          : ""
      } 
      ${
        variant === "warning"
          ? "bg-gradient-to-tl from-[#333333] to-yellow-500 bg-[length:135%_135%] hover:bg-[length:110%_110%]"
          : ""
      } 
      ${
        variant === "info"
          ? "bg-gradient-to-tl from-[#333333] to-blue-500 bg-[length:135%_135%] hover:bg-[length:110%_110%]"
          : ""
      } 
      ${className}
    `}
    >
      {children}
    </button>
  );
}
