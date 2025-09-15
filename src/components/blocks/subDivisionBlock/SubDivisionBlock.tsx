import { useEffect, useState } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Info } from "@/components/molecules/info/Info";
import { Section } from "@/components/molecules/section/Section";
import useSubdivisions from "@/hooks/useSubdivisions";
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

type TSubGeoWithData = GeographyV2 & { has_data: boolean };

export const SubDivisionBlock = ({ subdivisions, title = "Geographic sub-divisions" }: TProps) => {
  const subGeosWithDataQuery = useSubdivisions();
  const [subGeosWithHasData, setSubGeosWithHasData] = useState<TSubGeoWithData[]>([]);

  useEffect(() => {
    if (subGeosWithDataQuery.data && subdivisions) {
      const subGeosWithDataCodes = new Set(subGeosWithDataQuery.data.map((sd) => sd.code));
      const subdivionsWithData = subdivisions.filter((cs) => subGeosWithDataCodes.has(cs.id));
      if (subdivionsWithData.length === 0) {
        setSubGeosWithHasData([]);
      } else {
        const updatedSubGeos = subdivisions.map((subdivision) => ({
          ...subdivision,
          has_data: subGeosWithDataCodes.has(subdivision.id),
        }));
        setSubGeosWithHasData(updatedSubGeos);
      }
    }
  }, [subGeosWithDataQuery.data, subdivisions]);

  if (subGeosWithHasData.length === 0) {
    return null;
  }

  return (
    <Section block="subdivisions" title={title} count={subGeosWithHasData.length}>
      <div className="rounded bg-surface-ui py-6 px-10">
        <ol className="text-sm list-none pl-5 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 grid-flow-dense">
          {subGeosWithHasData.map((subdivision, index) => (
            <li
              key={index}
              className={`text-text-secondary col-start-1 ${get2ColumnClass(index, subGeosWithHasData.length)} ${get3ColumnClass(index, subGeosWithHasData.length)}`}
            >
              {subdivision.has_data ? (
                <LinkWithQuery href={`/geographies/${subdivision.slug}`} className="underline text-text-primary hover:text-text-brand-darker">
                  {subdivision.name}
                </LinkWithQuery>
              ) : (
                <span className="text-text-tertiary">
                  {subdivision.name}
                  <Info
                    description={`There are currently no documents associated with ${subdivision.name}`}
                    className="text-text-tertiary inline-block -mb-0.5 ml-1"
                  />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
};
