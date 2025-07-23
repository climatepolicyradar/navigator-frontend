import { ReactNode } from "react";

export interface IProps {
  children: ReactNode;
  id: string;
  title?: ReactNode;
}

export const Section = ({ children, id, title }: IProps) => {
  return (
    <section className="cols-3:col-span-2 cols-4:col-span-3" id={id}>
      {title && <h2 className="mb-5 text-xl text-text-primary font-semibold leading-tight">{title}</h2>}
      {children}
    </section>
  );
};
