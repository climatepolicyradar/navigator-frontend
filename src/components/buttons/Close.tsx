import React from "react";
import { Icon } from "@components/icon/Icon";

interface CloseProps {
  onClick(): void;
  size?: string;
}

const Close = ({ onClick, size = "20" }: CloseProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
  };
  return (
    <button
      className="focus:outline-none pointer-events-auto"
      onClick={handleClick}
      type="button"
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      aria-label="Close"
    >
      <Icon name="close" height={size} width={size} />
    </button>
  );
};
export default Close;
