import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  children: ReactNode;
  className?: string;
  verticalGap?: boolean;
  columnOverrides?: string[]; // Provides a way of overriding specific breakpointed grid layouts (use sparingly), indexed by breakpoint
}

// Actually 10 columns, in pairs of 2 up to 10
export const FiveColumns = ({ children, className, columnOverrides = [], verticalGap = false }: IProps) => {
  const columnLayouts = ["grid-cols-2", "cols5-2:grid-cols-4", "cols5-3:grid-cols-6", "cols5-4:grid-cols-8", "cols5-5:grid-cols-10"];

  const allClasses = joinTailwindClasses(
    "w-full max-w-(--MAX_SITE_WIDTH) grid flex-wrap px-2 mx-auto cols5-2:px-4 cols5-3:px-6 cols5-4:px-8",
    ...columnLayouts.map((columnLayout, columnIndex) => columnOverrides[columnIndex] || columnLayout),
    verticalGap ? "gap-2 cols5-2:gap-4 cols5-3:gap-6 cols5-4:gap-8" : "gap-x-2 cols5-2:gap-x-4 cols5-3:gap-x-6 cols5-4:gap-x-8",
    className
  );

  return <div className={allClasses}>{children}</div>;
};
