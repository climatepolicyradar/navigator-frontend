import { ReactNode } from "react";

type TEqualColumnProps = {
  children: ReactNode;
  extraClasses?: string;
  reverseColumn?: boolean; // Reverses the column order below md breakpoint
};

export const EqualColumns = ({ children, extraClasses = "", reverseColumn = false }: TEqualColumnProps) => {
  const columnDirection = reverseColumn ? "flex-col-reverse" : "flex-col";

  return <div className={`flex ${columnDirection} md:flex-row md:items-center ${extraClasses}`}>{children}</div>;
};

export const EqualColumn = ({ children, extraClasses = "" }: TEqualColumnProps) => <div className={`flex-1 h-auto ${extraClasses}`}>{children}</div>;
