import { FC, ReactNode } from "react";

type TProps = {
  children?: ReactNode;
};

export const Timeline: FC<TProps> = ({ children }) => {
  return (
    <div className="mt-4">
      <div className="flex place-content-center bg-gray-50 rounded border border-gray-200 drop-shadow-lg p-4">
        <div className="flex items-center overflow-x-auto px-[70px]">{children}</div>
      </div>
    </div>
  );
};
