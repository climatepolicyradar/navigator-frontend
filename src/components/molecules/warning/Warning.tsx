import { X } from "lucide-react";
import { useState, useEffect } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

type TProps = {
  className?: string;
  variant?: "info" | "disclaimer";
  hideableId?: string;
  children?: React.ReactNode;
};

export const Warning = ({ className, variant = "info", hideableId, children }: TProps) => {
  const [displayWarning, setDisplayWarning] = useState(false);

  const baseClasses = "mb-4 p-4 text-sm flex flex-col gap-2 relative";
  let bgColor = "";
  let textColor = "";
  let border = "";
  let spacing = hideableId ? "pr-10" : "";

  if (variant)
    switch (variant) {
      case "info":
        bgColor = "bg-surface-brand/16 rounded-md";
        textColor = "text-black";
        break;
      case "disclaimer":
        bgColor = "bg-surface-brand/16";
        textColor = "text-black";
        border = "pl-5 border-l-2 border-surface-brand";
        break;
    }

  const onHideClick = () => {
    if (!hideableId) return;
    if (typeof window === "undefined") return;
    sessionStorage.setItem(hideableId, "true");
    setDisplayWarning(false);
  };

  useEffect(() => {
    // Need to check if the hideableId is set in sessionStorage
    // Also check if the window object is available (to avoid SSR hydration issues)
    typeof window !== "undefined" && sessionStorage.getItem(hideableId) !== "true" ? setDisplayWarning(true) : setDisplayWarning(false);
  }, [hideableId]);

  if (!displayWarning) return null;

  return (
    <div className={joinTailwindClasses(baseClasses, bgColor, textColor, border, spacing, className)}>
      {hideableId && (
        <button onClick={onHideClick} className="text-text-brand absolute top-4 right-4 hover:opacity-80 transition-opacity">
          <X size="16" />
        </button>
      )}{" "}
      {children}
    </div>
  );
};
