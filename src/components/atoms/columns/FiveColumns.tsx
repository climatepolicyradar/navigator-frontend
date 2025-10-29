import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  children: ReactNode;
  className?: string;
  verticalGap?: boolean;
}

// Actually 10 columns, in pairs of 2 up to 10
export const FiveColumns = ({ children, className, verticalGap = false }: IProps) => {
  const allClasses = joinTailwindClasses(
    "w-full max-w-(--MAX_SITE_WIDTH) grid flex-wrap grid-cols-2 px-2 mx-auto cols5-2:grid-cols-4 cols5-2:px-4 cols5-3:grid-cols-6 cols5-3:px-6 cols5-4:grid-cols-8 cols5-4:px-8 cols5-5:grid-cols-10",
    verticalGap ? "gap-2 cols5-2:gap-4 cols5-3:gap-6 cols5-4:gap-8" : "gap-x-2 cols5-2:gap-x-4 cols5-3:gap-x-6 cols5-4:gap-x-8",
    className
  );

  return <div className={allClasses}>{children}</div>;
};
