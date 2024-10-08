import { useState } from "react";

type TProps = {
  className?: string;
  placeholder?: string;
  side?: "left" | "right";
  children?: React.ReactNode;
  onChange?: (value: string) => void;
};

const inputClasses = (side: "left" | "right") => {
  if (side === "left") {
    return "pl-8";
  } else {
    return "pr-8";
  }
};

export const TextInput = ({ className = "", onChange, children, side = "left", ...props }: TProps) => {
  const [input, setInput] = useState("");

  const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setInput(e.currentTarget.value);
    if (onChange) {
      onChange(e.currentTarget.value);
    }
  };

  return (
    <div className="relative">
      {side === "left" && <span className="input-icon icon-left">{children}</span>}
      <input type="text" value={input} onChange={handleChange} className={`w-full ${inputClasses(side)} ${className}`} {...props} />
      {side === "right" && <span className="input-icon icon-right">{children}</span>}
    </div>
  );
};
