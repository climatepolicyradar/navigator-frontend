import { FC, ReactNode } from "react";

type TCol = {
  children?: ReactNode;
};

export const SingleCol: FC<TCol> = ({ children }) => {
  return <div className="mt-8 mx-auto max-w-screen-md px-4">{children}</div>;
};
