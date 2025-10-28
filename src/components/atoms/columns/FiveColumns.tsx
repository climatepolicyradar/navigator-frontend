import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  children: ReactNode;
  className?: string;
}

/**
 * Five columns layout in pairs (10 columns max)
 *
 * BREAKPOINT COLUMNS SPACING
 * default    2       8px
 * cols5-2    4       16px
 * cols5-3    6       24px
 * cols5-4    8.      32px
 * cols5-5    10      32px
 */

export const FiveColumns = ({ children, className }: IProps) => {
  const allClasses = joinTailwindClasses(
    "w-full grid flex-wrap grid-cols-2 gap-x-2 px-2 cols5-2:grid-cols-4 cols5-2:gap-x-4 cols5-2:px-4 cols5-3:grid-cols-6 cols5-3:gap-x-6 cols5-3:px-6 cols5-4:grid-cols-8 cols5-4:gap-x-8 cols5-4:px-8 cols5-5:grid-cols-10 cols5-5:gap-x-8 cols5-5:px-8",
    className
  );

  return <div className={allClasses}>{children}</div>;
};
