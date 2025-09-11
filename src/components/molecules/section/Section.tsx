import { ReactNode } from "react";

import { TBlock } from "@/types";

export interface IGenericProps {
  children: ReactNode;
  title?: string;
  count?: number;
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

export const Section = ({ block, children, count, id, title }: TProps) => {
  const sectionId = block ? `section-${block}` : id;

  return (
    <section className="cols-3:col-span-2 cols-4:col-span-3 scroll-mt-35 sm:scroll-mt-21" id={sectionId}>
      {title && (
        <h2 className="mb-5 text-xl text-text-primary font-[660] leading-tight">
          <span>{title}</span>
          {count !== undefined && <span className="ml-2 text-text-tertiary font-normal">{count}</span>}
        </h2>
      )}
      {children}
    </section>
  );
};
