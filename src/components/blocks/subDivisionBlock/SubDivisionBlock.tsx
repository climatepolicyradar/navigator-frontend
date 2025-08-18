import { ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Section } from "@/components/molecules/section/Section";
import { TGeographySubdivision } from "@/types";

type TProps = {
  title?: ReactNode;
  id: string;
  subdivisions: TGeographySubdivision[];
};

export const SubDivisionBlock = ({ title, id, subdivisions }: TProps) => {
  return (
    <Section title={title} id={id}>
      <div className="rounded bg-surface-ui py-6 px-10">
        <ol className="list-none pl-5 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {subdivisions.map((subdivision, index) => (
            <li key={index} className="text-text-secondary">
              <LinkWithQuery href={`/geographies/${subdivision.code}`} className="underline text-text-primary hover:text-text-brand-darker">
                {subdivision.name}
              </LinkWithQuery>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
};
