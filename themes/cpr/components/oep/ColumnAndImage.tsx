import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  extraClasses?: string;
}

export const ColumnAndImage = ({ children, extraClasses = "" }: IProps) => (
  <div className={`flex flex-col max-w-[775px] lg:max-w-[440px] ${extraClasses}`}>{children}</div>
);
