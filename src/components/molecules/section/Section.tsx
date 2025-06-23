import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

import { Badge } from "../../atoms/label/Badge";

export interface IProps {
  children: ReactNode;
  className?: string;
  controls?: ReactNode;
  explanation?: ReactNode;
  title: string | ReactNode;
  titleBadge?: string;
}

export const Section = ({ children, className, controls, explanation, title, titleBadge }: IProps) => {
  const sectionClasses = joinTailwindClasses("mt-10 mb-12 cols-3:mt-20 cols-3:mb-24 cols-3:col-span-2 cols-4:col-span-3", className);

  return (
    <section className={sectionClasses}>
      <div className="grid grid-cols-1 cols-3:grid-cols-2 cols-4:grid-cols-3 gap-x-6 gap-y-3">
        <h2 className="text-2xl text-text-primary leading-tight font-[640] cols-3:col-span-2 order-1 self-center">
          {title}
          {titleBadge && (
            <>
              &ensp;<Badge className="mb-0.5 align-middle">{titleBadge}</Badge>
            </>
          )}
        </h2>
        {explanation && <div className="cols-3:col-span-2 order-3">{explanation}</div>}
        {controls && <div className="flex cols-4:justify-end items-center order-4 cols-4:order-2">{controls}</div>}
      </div>
      {children}
    </section>
  );
};
