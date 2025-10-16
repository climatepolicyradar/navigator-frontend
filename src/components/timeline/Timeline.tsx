import { FC, ReactNode } from "react";

interface IProps {
  children?: ReactNode;
}

export const Timeline: FC<IProps> = ({ children }) => {
  return (
    <div className="mt-4">
      <div className="flex place-content-center bg-gray-50 rounded border border-gray-300 drop-shadow-lg p-4">
        <div className="flex items-center overflow-x-auto px-[70px]">{children}</div>
      </div>
    </div>
  );
};
