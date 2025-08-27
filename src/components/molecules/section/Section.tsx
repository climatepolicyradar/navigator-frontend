import { ReactNode } from "react";

export interface IProps {
  children: ReactNode;
  id: string;
  title?: string;
  count?: number;
}

export const Section = ({ children, count, id, title }: IProps) => {
  return (
    <section className="cols-3:col-span-2 cols-4:col-span-3 scroll-mt-35 sm:scroll-mt-21" id={id}>
      {title && (
        <h2 className="mb-5 text-xl text-text-primary font-[660] leading-tight">
          <span>{title}</span>
          {count && <span className="ml-2 text-text-tertiary font-normal">{count}</span>}
        </h2>
      )}
      {children}
    </section>
  );
};
