import { ReactNode } from "react";

type TNarrowProps = {
  children: ReactNode;
  extraClasses?: string;
};

export const Narrow = ({ children, extraClasses = "" }: TNarrowProps) => <div className={`max-w-[775px] ${extraClasses}`}>{children}</div>;
