import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?(event: React.FormEvent<HTMLButtonElement>): void;
  color?: "light" | "clear" | "ghost" | "secondary";
  id?: string;
  extraClasses?: string;
  "data-cy"?: string;
  fullWidth?: boolean;
  thin?: boolean;
  wider?: boolean;
}

const Button = ({
  children,
  type = "button",
  disabled = false,
  onClick = null,
  color = "light",
  id,
  extraClasses = "",
  fullWidth = false,
  thin = false,
  wider = false,
  ...props
}: ButtonProps) => {
  let conditionalClasses = "";
  switch (color) {
    case "light":
      conditionalClasses = "bg-blue-500 border border-blue-500 text-white hover:bg-blue-700 hover:border-blue-700 hover:text-white group-hover:bg-blue-700 group-hover:border-blue-700 group-hover:text-white";
      break;
    case "secondary":
      conditionalClasses = "bg-white border border-gray-300 text-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white";
      break;
    case "ghost":
      conditionalClasses = "underline bg-transparent border border-transparent text-blue-600";
      break;
    case "clear":
      conditionalClasses = !disabled
        ? "clear bg-transparent border border-gray-300 hover:border-blue-400 text-blue-400 disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-white"
        : "";
      break;
  }
  conditionalClasses += " " + (thin ? "py-1" : "py-2");
  conditionalClasses += " " + (wider ? "px-12" : "px-4");
  conditionalClasses += " " + (!fullWidth ? "md:w-auto" : "");
  if (disabled) {
    conditionalClasses +=
      " " + "pointer-events-none bg-gray-300 text-gray-200 border-gray-300 hover:bg-gray-300 hover:text-gray-200 hover:border-gray-300";
  }
  conditionalClasses += " " + extraClasses;

  return (
    <button
      id={id}
      onClick={onClick}
      type={type}
      disabled={disabled}
      data-cy={props["data-cy"]}
      className={`button transition duration-300 px-4 rounded-full pointer-events-auto w-full font-bold ${conditionalClasses}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
