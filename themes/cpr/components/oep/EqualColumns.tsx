import { ReactNode } from "react";

type TEqualColumnProps = {
  children: ReactNode;
  extraClasses?: string;
};

export const EqualColumns = ({ children, extraClasses = "" }: TEqualColumnProps) => (
  <div className={`flex flex-row items-center ${extraClasses}`}>{children}</div>
);

export const EqualColumn = ({ children, extraClasses = "" }: TEqualColumnProps) => <div className={`flex-1 h-auto ${extraClasses}`}>{children}</div>;
