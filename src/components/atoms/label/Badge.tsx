import { ComponentProps } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IBadgeClassArgs {
  className?: string;
  size?: "small" | "medium";
}

type TProps = IBadgeClassArgs & ComponentProps<"div">;

export const getBadgeClasses = ({ className, size = "medium" }: TProps) => {
  const baseClasses = "inline-block bg-surface-brand rounded-sm text-text-light leading-none whitespace-nowrap align-baseline select-none";
  const textClasses = size === "medium" ? "text-[13px] leading-1 font-medium" : "text-xs leading-normal font-semibold";
  const shapeClasses = size === "medium" ? "px-1.5 py-[5px]" : "px-1 py-0.5";

  return joinTailwindClasses(baseClasses, textClasses, shapeClasses, className);
};

export const Badge = ({ children, className, size = "medium", ...props }: TProps) => {
  const allClasses = getBadgeClasses({ className, size });

  return (
    <div className={allClasses} {...props}>
      {children}
    </div>
  );
};
