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
    const baseClasses = "flex flex-row text-sm leading-3.5 font-medium transition duration-200 focus:outline-2 focus:outline-offset-2";

    /* Colour */

    let bgColor = color === "brand" ? "bg-surface-brand hocus:bg-surface-brand-dark" : "bg-surface-mono hocus:bg-surface-mono-dark";
    let textColor = "text-text-light";

    if (variant)
      switch (variant) {
        case "faded":
          bgColor = color === "brand" ? "bg-surface-brand/16 hocus:bg-surface-brand/32" : "bg-surface-mono/16 hocus:bg-surface-mono/32";
          textColor = color === "brand" ? "text-cpr-blue" : "text-text-primary";
          break;
        case "outlined":
        case "ghost":
          bgColor = "bg-transparent hover:bg-surface-ui";
          textColor = color === "brand" ? "text-cpr-blue" : "text-text-primary";
          break;
      }

    if (disabled) {
      bgColor = "bg-surface-ui";
      textColor = "text-text-tertiary";
    }

    /* Shape */

    const border = variant === "outlined" ? "border border-border-grey" : "";
    const outlineColor = color === "brand" ? "outline-surface-brand-dark" : "outline-surface-mono-dark";
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

    /* Interaction */

    const cursor = disabled ? "pointer-events-none" : "";

    return [baseClasses, padding, bgColor, border, outlineColor, roundness, textColor, cursor, className].filter((classes) => classes).join(" ");
  }, [className, color, disabled, rounded, size, variant]);

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
