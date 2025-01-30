import { ReactNode } from "react";

type TColumnAndImageProp = {
  children: ReactNode;
  extraClasses?: string;
};

export const ColumnAndImage = ({ children, extraClasses = "" }: TColumnAndImageProp) => (
  <div className={`flex flex-col max-w-[775px] lg:max-w-[440px] ${extraClasses}`}>{children}</div>
);
