import { ReactNode } from "react";

type TSectionProps = {
  children: ReactNode;
  containerClasses?: string;
  sectionClasses?: string;
};

// TODO remove border debug
export const Section = ({ children, containerClasses = "", sectionClasses = "" }: TSectionProps) => (
  <section className={`border border-green-800 ${sectionClasses}`}>
    <div className={`max-w-[1000px] w-full mx-auto text-textDark ${containerClasses}`}>{children}</div>
  </section>
);
