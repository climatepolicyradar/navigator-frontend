import { ReactNode } from "react";

type TColumnAndImageProp = {
  children: ReactNode;
  extraClasses?: string;
};

export const ColumnAndImage = ({ children, extraClasses = "" }: TColumnAndImageProp) => <div className={`w-[440px] ${extraClasses}`}>{children}</div>;
