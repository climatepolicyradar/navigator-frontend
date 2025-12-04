import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { Badge } from "@/components/atoms/badge/Badge";
import { TBlock } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

export interface IGenericProps {
  badge?: string;
  children: ReactNode;
  count?: number;
  Icon?: LucideIcon;
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

export const Section = ({ badge, block, children, count, Icon, id, title, wide = false }: TProps) => {
  const sectionId = block ? `section-${block}` : id;

  const sectionClasses = joinTailwindClasses(
    "grid grid-cols-subgrid col-start-1 -col-end-1 scroll-mt-40 cols-4:scroll-mt-26",
    !wide && "cols-5:-col-end-3"
  );

  return (
    <section className={sectionClasses} id={sectionId}>
      {title && (
        <h2 className="block col-start-1 -col-end-1 mb-5 text-2xl text-gray-950 font-heavy leading-tight">
          {Icon && (
            <span>
              <Icon size={22} className="inline mb-1.5 text-brand" />
              &nbsp;
            </span>
          )}
          <span>{title}</span>
          {count !== undefined && <span className="text-gray-500 font-normal">&nbsp;&nbsp;{count}</span>}
          {badge && (
            <span>
              &nbsp;&nbsp;<Badge className="align-middle">{badge}</Badge>
            </span>
          )}
        </h2>
      )}
      {children}
    </section>
  );
};
