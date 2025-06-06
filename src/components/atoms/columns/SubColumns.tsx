import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  children: ReactNode;
  className?: string;
}

export const SubColumns = ({ children, className }: IProps) => {
  const allClasses = joinTailwindClasses("grid grid-cols-3 gap-6", className);

  return <div className={allClasses}>{children}</div>;
};
