import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?(event: React.FormEvent<HTMLButtonElement>): void;
  color?: "default";
  id?: string;
  extraClasses?: string;
  "data-cy"?: string;
  fullWidth?: boolean;
  thin?: boolean;
  wider?: boolean;
}

const Button = ({ children, type = "button", disabled = false, onClick = null, color = "default", id, extraClasses = "", ...props }: ButtonProps) => {
  // let classes = "bg-indigo-600 text-white border border-indigo-600 hover:bg-white hover:border-white hover:text-indigo-600";
  let classes = "text-white font-medium bg-primary-600 px-4 py-2 text-[14px]";

  return (
    <button id={id} onClick={onClick} type={type} disabled={disabled} data-cy={props["data-cy"]} className={classes + extraClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
