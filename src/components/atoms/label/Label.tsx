import { ComponentProps, ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends ComponentProps<"button"> {
  children: ReactNode;
}

export const Label = ({ children, className = "", role = "button", ...buttonProps }: IProps) => {
  const allClasses = joinTailwindClasses(
    "px-2 py-1 bg-white border border-gray-300 rounded-full text-sm text-brand font-medium leading-4",
    className
  );

  return (
    <button {...buttonProps} role={role} className={allClasses}>
      {children}
    </button>
  );
};
