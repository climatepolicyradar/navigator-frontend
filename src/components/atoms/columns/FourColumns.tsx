import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  children: ReactNode;
  containerClasses?: string;
  gridClasses?: string;
}

export const FourColumns = ({ children, containerClasses, gridClasses }: IProps) => {
  const allContainerClasses = joinTailwindClasses("px-3 cols-2:px-6 cols-3:px-8", containerClasses);

  const allGridClasses = joinTailwindClasses("grid grid-cols-1 cols-2:grid-cols-2 cols-3:grid-cols-3 cols-4:grid-cols-4 gap-6", gridClasses);

  return (
    <div className={allContainerClasses}>
      <div className={allGridClasses}>{children}</div>
    </div>
  );
};
