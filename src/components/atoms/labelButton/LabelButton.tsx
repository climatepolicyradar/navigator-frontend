import { ComponentProps, ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends ComponentProps<"button"> {
  children: ReactNode;
}

export const LabelButton = ({ children, className = "", role = "button", ...buttonProps }: IProps) => {
  const allClasses = joinTailwindClasses(
    "inline-block px-2 py-1 bg-white hover:bg-brand border border-gray-300 hover:border-brand rounded-xl text-sm text-brand hover:text-white text-left font-medium leading-4 transition duration-100",
    className
  );

  return (
    <button {...buttonProps} role={role} className={allClasses}>
      {children}
    </button>
  );
};
