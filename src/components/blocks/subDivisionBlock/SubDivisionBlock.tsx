import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Info } from "@/components/molecules/info/Info";
import { Section } from "@/components/molecules/section/Section";
import { ID_SEPARATOR } from "@/constants/chars";
import { TNestedSearchLabel } from "@/types";
import { getGeographySlug } from "@/utils/geography";

type TProps = {
  country: TNestedSearchLabel;
  exclude?: string;
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

const UK_SUBDIVISION_CODES = new Set(["GB-ENG", "GB-WLS", "GB-SCT", "GB-NIR"]);

const getCode = (label: TNestedSearchLabel): string => label.id.split(ID_SEPARATOR)[1];

const getSubdivisions = (country: TNestedSearchLabel, exclude?: string): TNestedSearchLabel[] => {
  const subdivisions = country.children
    .filter((label) => label.type === "subdivision" && getGeographySlug(label) && getGeographySlug(label) !== exclude)
    .sort((a, b) => a.value.localeCompare(b.value, "en"));

  if (!subdivisions.some((label) => label.count)) return [];

  // TODO: remove later. Special case for UK - only show the four countries
  if (country.id === `country${ID_SEPARATOR}GBR`) return subdivisions.filter((label) => UK_SUBDIVISION_CODES.has(getCode(label)));

  return subdivisions;
};

export const SubDivisionBlock = ({ country, exclude, title = "Geographic sub-divisions" }: TProps) => {
  const subdivisions = getSubdivisions(country, exclude);

  if (subdivisions.length === 0) {
    return null;
  }

  return (
    <Section block="subdivisions" title={title} count={subdivisions.length}>
      <div className="col-start-1 -col-end-1 rounded bg-[#f5f5f5] py-6 px-10">
        <ol className="text-sm list-none pl-5 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 grid-flow-dense">
          {subdivisions.map((subdivision, index) => (
            <li
              key={index}
              className={`text-text-secondary col-start-1 ${get2ColumnClass(index, subdivisions.length)} ${get3ColumnClass(index, subdivisions.length)}`}
            >
              {subdivision.count ? (
                <LinkWithQuery
                  href={`/geographies/${getGeographySlug(subdivision)}`}
                  className="underline text-text-primary hover:text-[#002ca3]"
                  data-ph-capture-attribute-link-purpose="subdivision"
                  data-ph-capture-attribute-subdivision={getCode(subdivision)}
                >
                  {subdivision.value}
                </LinkWithQuery>
              ) : (
                <span className="text-text-tertiary">
                  {subdivision.value}
                  <Info
                    description={`There are currently no documents associated with ${subdivision.value}`}
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
