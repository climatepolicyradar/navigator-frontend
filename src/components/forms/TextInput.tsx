import { useState } from "react";

type TProps = {
  type?: string;
  className?: string;
  placeholder?: string;
  side?: "left" | "right";
  children?: React.ReactNode;
  size?: "small" | "large" | "default";
  onChange?: (value: string) => void;
};

const iconClasses = (side: "left" | "right", children?: React.ReactNode) => {
  if (children) {
    if (side === "left") {
      return "extra-content-left";
    } else {
      return "extra-content-right";
    }
  }
};

export const TextInput = ({ type = "text", size = "default", className = "", placeholder, onChange, children, side = "left", ...props }: TProps) => {
  const [input, setInput] = useState("");

  const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setInput(e.currentTarget.value);
    if (onChange) {
      onChange(e.currentTarget.value);
    }
  };

  return (
    <div className={`relative ${size}`}>
      {side === "left" && <span className="input-icon icon-left">{children}</span>}
      <input
        type={type}
        value={input}
        onChange={handleChange}
        className={` ${size} ${iconClasses(side, children)} ${className}`}
        placeholder={placeholder}
        {...props}
      />
      {side === "right" && <span className="input-icon icon-right">{children}</span>}
    </div>
  );
};
