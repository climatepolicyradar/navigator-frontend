import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  extraClasses?: string;
}

export const Narrow = ({ children, extraClasses = "" }: IProps) => <div className={`max-w-[775px] ${extraClasses}`}>{children}</div>;
