import { FC, ReactNode } from "react";

type TProps = {
  children?: ReactNode;
};

export const Hero: FC<TProps> = ({ children }) => {
  return <section className="absolute inset-0 z-10 flex flex-col items-center justify-center min-h-[800px]">{children}</section>;
};
