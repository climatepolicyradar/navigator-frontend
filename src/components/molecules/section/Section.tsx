import { ReactNode } from "react";

import { TBlock } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

export interface IGenericProps {
  children: ReactNode;
  count?: number;
  title?: string;
  wide?: boolean;
}

export interface IBlockProps extends IGenericProps {
  block: TBlock;
  id?: never;
}

export interface IProgrammaticProps extends IGenericProps {
  block?: never;
  id: string;
}

export type TProps = IBlockProps | IProgrammaticProps;

export const Section = ({ block, children, count, id, title, wide = false }: TProps) => {
  const sectionId = block ? `section-${block}` : id;

  const sectionClasses = joinTailwindClasses("col-start-1 -col-end-1 scroll-mt-40 cols-4:scroll-mt-26", !wide && "cols-5:-col-end-3");

  return (
    <section className={sectionClasses} id={sectionId}>
      {title && (
        <h2 className="mb-5 text-2xl text-gray-950 font-heavy leading-tight">
          <span>{title}</span>
          {count !== undefined && <span className="text-gray-500 font-normal">&nbsp;&nbsp;{count}</span>}
        </h2>
      )}
      {children}
    </section>
  );
};
