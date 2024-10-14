import React from "react";

type TButtonColours = "light" | "clear" | "ghost" | "secondary" | "dark" | "dark-dark" | "clear-underline";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?(event: React.FormEvent<HTMLButtonElement>): void;
  color?: TButtonColours;
  id?: string;
  extraClasses?: string;
  "data-cy"?: string;
  fullWidth?: boolean;
  thin?: boolean;
  wider?: boolean;
}

export const getButtonClasses = (
  color: TButtonColours = "light",
  disabled = false,
  extraClasses = "",
  thin = false,
  wider = false,
  fullWidth = false
) => {
  let classes = "button block transition duration-300 px-4 rounded-full pointer-events-auto font-medium no-underline hover:no-underline ";
  switch (color) {
    case "light":
      classes +=
        "bg-blue-500 border border-blue-500 text-white hover:bg-blue-700 hover:border-blue-700 hover:text-white group-hover:bg-blue-700 group-hover:border-blue-700 group-hover:text-white";
      break;
    case "secondary":
      classes +=
        "bg-white border border-gray-300 text-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-white group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white";
      break;
    case "ghost":
      classes += "underline bg-transparent border border-transparent text-blue-600";
      break;
    case "dark":
      classes += "text-white bg-cclw-light border border-gray-500 font-normal hover:bg-gray-700";
      break;
    case "dark-dark":
      classes += "text-white bg-blueGray-800 border border-blueGray-700 font-normal hover:bg-blueGray-700";
      break;
    case "clear":
      classes += !disabled
        ? "clear bg-transparent border border-gray-300 hover:border-gray-600 text-gray-600 disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-white"
        : "";
      break;
    case "clear-underline":
      classes += "bg-transparent text-sm text-gray-500 hover:bg-gray-100 !underline";
      break;
  }
  classes += " " + (thin ? "py-1" : "py-2");
  classes += " " + (wider ? "px-12" : "px-4");
  classes += " " + (fullWidth ? "w-full" : "");
  if (disabled) {
    classes += " " + "pointer-events-none bg-gray-300 text-gray-200 border-gray-300 hover:bg-gray-300 hover:text-gray-200 hover:border-gray-300";
  }
  classes += " " + extraClasses;
  return classes;
};

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
  return (
    <button
      id={id}
      onClick={onClick}
      type={type}
      disabled={disabled}
      data-cy={props["data-cy"]}
      className={getButtonClasses(color, disabled, extraClasses, thin, wider, fullWidth)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
