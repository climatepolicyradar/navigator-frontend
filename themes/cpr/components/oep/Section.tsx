import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  containerClasses?: string;
  sectionClasses?: string;
}

export const Section = ({ children, containerClasses = "", sectionClasses = "" }: IProps) => (
  <section className={sectionClasses}>
    <div className={`max-w-[1000px] w-full px-5 lg:px-0 mx-auto text-textDark ${containerClasses}`}>{children}</div>
  </section>
);
