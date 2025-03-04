import { useMemo } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: "brand" | "mono";
  size?: "small" | "medium" | "large";
  rounded?: boolean;
  variant?: "solid" | "faded" | "outlined" | "ghost";
}

export const Button = ({
  children,
  className,
  color = "brand",
  disabled = false,
  size = "medium",
  rounded = false,
  variant = "solid",
  ...props
}: ButtonProps) => {
  const classes = useMemo(() => {
    const baseClasses = "flex flex-row text-sm leading-3.5 font-medium";

    /* Colour */

    // TODO theme support
    let bgColor = color === "brand" ? "bg-cpr-blue" : "bg-text-primary";
    let textColor = "text-text-white";

    if (variant)
      switch (variant) {
        case "faded":
          bgColor = color === "brand" ? "bg-cpr-blue/16" : "bg-text-primary/16";
          textColor = color === "brand" ? "text-cpr-blue" : "text-text-primary";
          break;
        case "outlined":
        case "ghost":
          bgColor = "bg-transparent";
          textColor = color === "brand" ? "text-cpr-blue" : "text-text-primary";
          break;
      }

    if (disabled) {
      bgColor = "bg-surface-ui";
      textColor = "text-text-tertiary";
    }

    /* Shape */

    const border = variant === "outlined" ? "border border-border-grey" : "";
    const roundness = rounded ? "rounded-full" : "rounded-md";

    /* Size */

    let padding = "px-4 py-3";

    switch (size) {
      case "small":
        padding = "px-2 py-2.5";
        break;
      case "large":
        padding = "px-4 py-5";
        break;
    }

    return [baseClasses, padding, bgColor, border, roundness, textColor, className].filter((classes) => classes).join(" ");
  }, [className, color, disabled, rounded, size, variant]);

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
