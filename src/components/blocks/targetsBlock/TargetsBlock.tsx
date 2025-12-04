import { useContext, useState } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { Section } from "@/components/molecules/section/Section";
import { ThemeContext } from "@/context/ThemeContext";
import { TTarget } from "@/types";

const MAX_ENTRIES_SHOWN = 3;

interface IProps {
  targets: TTarget[];
}

export const TargetsBlock = ({ targets }: IProps) => {
  const { theme } = useContext(ThemeContext);
  const [showAllEntries, setShowAllEntries] = useState(false);

  if (targets.length === 0) return null;

  const getMetadata = (target: TTarget): string[] => {
    const metadata = [];

    if (target.Sector) metadata.push(target.Sector);
    if (target.Year) metadata.push(`Target year: ${target.Year}`);

    return metadata;
  };

  const showSourceLink = (target: TTarget) => Boolean(target["family-slug"] && target["family-name"]);

  const toggleShowAll = () => {
    setShowAllEntries((current) => !current);
  };

  const linkDomain = theme === "ccc" ? "https://app.climatepolicyradar.org" : "";
  const shownTargets = showAllEntries ? targets : targets.slice(0, MAX_ENTRIES_SHOWN);
  const entriesToHide = targets.length > MAX_ENTRIES_SHOWN;

  if (shownTargets.length === 0) return null;

  return (
    <Section block="targets" title="Targets" count={targets.length}>
      <div className="col-start-1 -col-end-1 flex flex-col gap-4 items-start">
        {shownTargets.map((target) => {
          return (
            <PageLink key={target.ID} href={`${linkDomain}/document/${target["family-slug"]}`} className="group">
              <h3 className="text-gray-950 font-medium" dangerouslySetInnerHTML={{ __html: target.Description }} />
              <span className="block text-sm">{getMetadata(target).join(`, `)}</span>
              {showSourceLink(target) && (
                <span className="block text-sm">
                  Source:{" "}
                  <span className="underline underline-offset-4 decoration-gray-300 group-hover:decoration-gray-500">{target["family-name"]}</span>
                </span>
              )}
            </PageLink>
          );
        })}
        {entriesToHide && (
          <button
            type="button"
            onClick={toggleShowAll}
            className="p-2 hover:bg-gray-50 active:bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 leading-4 font-medium"
          >
            {showAllEntries ? "View less" : "View more"}
          </button>
        )}
      </div>
    </Section>
  );
};
