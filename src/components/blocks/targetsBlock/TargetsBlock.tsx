import { useState } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { Section } from "@/components/molecules/section/Section";
import { MIDDOT } from "@/constants/chars";
import { TTarget, TTheme } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

const MAX_ENTRIES_SHOWN = 3;

interface IProps {
  targets: TTarget[];
  theme: TTheme;
}

export const TargetsBlock = ({ targets, theme }: IProps) => {
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
  const containerClasses = joinTailwindClasses("relative", entriesToHide && "pb-4");

  return (
    <Section block="targets" title="Targets" count={targets.length}>
      <div className={containerClasses}>
        <Card className="!p-12 flex flex-col gap-10 bg-surface-ui rounded-sm">
          {shownTargets.map((target) => {
            return (
              <div key={target.ID} className="flex flex-col gap-2.5 text-sm text-text-tertiary leading-tight">
                <h3 className="text-lg text-text-primary font-semibold" dangerouslySetInnerHTML={{ __html: target.Description }} />
                <span className="">{getMetadata(target).join(` ${MIDDOT} `)}</span>
                {showSourceLink(target) && (
                  <span className="">
                    Source:{" "}
                    <LinkWithQuery href={`${linkDomain}/document/${target["family-slug"]}`} className="underline">
                      {target["family-name"]}
                    </LinkWithQuery>
                  </span>
                )}
              </div>
            );
          })}
        </Card>
        {entriesToHide && (
          <Button color="mono" size="small" rounded onClick={toggleShowAll} className="absolute bottom-0 left-12">
            {showAllEntries ? "Show less" : "Show all"}
          </Button>
        )}
      </div>
    </Section>
  );
};
