import { FC, ReactNode } from "react";

interface IProps {
  color?: string;
  children?: ReactNode;
}

export const Divider: FC<IProps> = ({ children, color }) => {
  const dividerColor = color ?? "bg-gray-200";

  return (
    <div className="relative">
      <div className={`${dividerColor} w-full h-px absolute top-1/2 z-0`}></div>
      <div className="flex justify-center relative z-10">{children}</div>
    </div>
  );
};
