import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?(event: React.FormEvent<HTMLButtonElement>): void;
  color?: "dark" | "light" | "clear" | "light-hover-dark" | "secondary";
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
  let conditionalClasses = "bg-indigo-600 text-white border border-indigo-600 hover:bg-white hover:border-white hover:text-indigo-600";
  switch (color) {
    case "light":
      conditionalClasses = "bg-blue-500 border border-blue-500 text-white hover:bg-secondary-700 hover:border-secondary-700 hover:text-white";
      break;
    case "secondary":
      conditionalClasses = "bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white";
      break;
    case "light-hover-dark":
      conditionalClasses = "bg-blue-500 border border-blue-500 text-white hover:bg-indigo-600 hover:border-indigo-600 hover:text-white";
      break;
    case "clear":
      conditionalClasses = !disabled
        ? "clear bg-white border hover:border-indigo-600 text-indigo-600 disabled:border-indigo-300 disabled:text-indigo-300 disabled:hover:bg-white"
        : "";
      break;
  }
  conditionalClasses += " " + (thin ? "py-1" : "py-3");
  conditionalClasses += " " + (wider ? "px-12" : "px-8");
  conditionalClasses += " " + (!fullWidth ? "md:w-auto" : "");
  if (disabled) {
    conditionalClasses +=
      " " + "pointer-events-none bg-indigo-300 text-indigo-200 border-indigo-300 hover:bg-indigo-300 hover:text-indigo-200 hover:border-indigo-300";
  }
  conditionalClasses += " " + extraClasses;

  return (
    <button
      id={id}
      onClick={onClick}
      type={type}
      disabled={disabled}
      data-cy={props["data-cy"]}
      className={`button transition duration-300 px-4 rounded-sm pointer-events-auto w-full font-bold ${conditionalClasses}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
