import { useMemo } from "react";

interface ButtonClassArgs {
  className?: string;
  color?: "brand" | "mono";
  content?: "text" | "icon" | "both";
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  rounded?: boolean;
  variant?: "solid" | "faded" | "outlined" | "ghost";
}

type ButtonProps = ButtonClassArgs & React.ComponentProps<"button">;

export const getButtonClasses = ({
  className,
  color = "brand",
  content = "text",
  disabled = false,
  rounded = false,
  size = "medium",
  variant = "solid",
}: ButtonClassArgs) => {
  const baseClasses =
    "flex flex-row items-center justify-center text-sm leading-3.5 font-medium transition duration-200 focus-visible:outline-2 outline-offset-2";

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

  const isIcon = content === "icon";
  let layout = content === "both" ? "gap-2" : "";
  let sizing = "";

  switch (size) {
    case "small":
      sizing = isIcon ? "w-7 h-7" : "px-2 py-2.5";
      break;
    case "medium":
      sizing = isIcon ? "w-9 h-9" : "px-4 py-3";
      break;
    case "large":
      sizing = isIcon ? "w-12 h-12" : "px-4 py-5";
      break;
  }

  /* Interaction */

  const cursor = disabled ? "pointer-events-none" : "";

  return [baseClasses, layout, sizing, bgColor, border, outlineColor, roundness, textColor, cursor, className].filter((classes) => classes).join(" ");
};

export const Button = ({
  children,
  className,
  color = "brand",
  content = "text",
  disabled = false,
  size = "medium",
  rounded = false,
  variant = "solid",
  ...props
}: ButtonProps) => {
  const classes = useMemo(
    () => getButtonClasses({ className, color, content, disabled, size, rounded, variant }),
    [className, color, content, disabled, size, rounded, variant]
  );

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
