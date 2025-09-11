import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Section } from "@/components/molecules/section/Section";
import { GeographyV2 } from "@/types";

type TProps = {
  subdivisions: GeographyV2[];
  title?: string;
};

const get2ColumnClass = (index: number, length: number): string => {
  if (index >= length / 2) {
    return "md:col-start-2";
  }
  return "";
};

const get3ColumnClass = (index: number, length: number): string => {
  const third = length / 3;
  if (index >= third * 2) {
    return "xl:col-start-3";
  } else if (index >= third) {
    return "xl:col-start-2";
  }
  return "";
};

export const SubDivisionBlock = ({ subdivisions, title = "Geographic sub-divisions" }: TProps) => {
  if (!subdivisions || subdivisions.length === 0) {
    return null;
  }

  return (
    <Section block="subdivisions" title={title} count={subdivisions.length}>
      <div className="rounded bg-surface-ui py-6 px-10">
        <ol className="text-sm list-none pl-5 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 grid-flow-dense">
          {subdivisions.map((subdivision, index) => (
            <li
              key={index}
              className={`text-text-secondary col-start-1 ${get2ColumnClass(index, subdivisions.length)} ${get3ColumnClass(index, subdivisions.length)}`}
            >
              <LinkWithQuery href={`/geographies/${subdivision.slug}`} className="underline text-text-primary hover:text-text-brand-darker">
                {subdivision.name}
              </LinkWithQuery>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
};
