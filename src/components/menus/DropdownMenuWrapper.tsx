import React, { FC, ReactNode } from "react";

interface IProps {
  children?: ReactNode;
}

const DropdownMenuWrapper: FC<IProps> = ({ children }) => {
  return (
    <div data-cy="dropdown-menu" className="rounded shadow-xl py-2 w-[200px] bg-gray-100">
      {children}
    </div>
  );
};

export default DropdownMenuWrapper;
