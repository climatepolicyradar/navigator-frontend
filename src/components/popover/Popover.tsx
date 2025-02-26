import { ReactNode } from "react";

type TProps = { children?: ReactNode };

export const Popover = ({ children }: TProps) => {
  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-md border border-gray-200 flex items-start">
      <div className="space-y-6 w-full">{children}</div>
    </div>
  );
};
