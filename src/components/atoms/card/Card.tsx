import React, { useMemo } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface CardClassArgs {
  className?: string;
  color?: "brand" | "mono";
  variant?: "solid" | "outlined";
}

type CardProps = CardClassArgs & React.ComponentProps<"div">;

const getCardClasses = ({ className = "", color = "brand", variant = "solid" }: CardClassArgs) => {
  const isSolid = variant === "solid";
  const baseClasses = "px-5 py-4 rounded-md";

  /* Colour */

  const border = isSolid ? "" : "border border-border-light";
  const textColor = isSolid ? "text-text-light" : "text-text-primary";
  let bgColor = "bg-surface-light";

  if (isSolid) {
    bgColor = color === "brand" ? "bg-surface-brand" : "bg-surface-mono";
  }

  return joinTailwindClasses(baseClasses, bgColor, border, textColor, className);
};

export const Card = ({ children, className, color = "brand", variant = "solid", ...props }: CardProps) => {
  const classes = useMemo(() => getCardClasses({ className, color, variant }), [className, color, variant]);

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
