import { LinkWithQuery } from "./LinkWithQuery";

import { TTarget } from "@types";

type TTargets = {
  targets: TTarget[];
  showFamilyInfo?: boolean;
};

// Ordering TBC:
// source = plan, law, framework, strategy, policy
// law above others

export const Targets = ({ targets = [], showFamilyInfo = false }: TTargets) => {
  if (!targets.length) return null;

  const showSourceLink = (target: TTarget) => {
    if (!target["family-slug"] || !target["family-name"]) return false;
    if (target["family-slug"] === "" || target["family-name"] === "") return false;
    return showFamilyInfo;
  };

  const showTargetYear = (target: TTarget) => {
    const middotCharCode = 183;
    if (!target.Year || target.Year === "") return "";
    return ` ${String.fromCharCode(middotCharCode)} Target year: ${target.Year}`;
  };

  return (
    <ul className="" data-cy="targets">
      {targets.map((target) => (
        <li className="mt-5 flex flex-col gap-2 border-b border-gray-200 pb-5 last:border-0" key={target.ID}>
          <span dangerouslySetInnerHTML={{ __html: target.Description }} className="font-medium text-textDark" />
          <span className="text-sm">
            {`${target.Sector}${target.Scopes !== "" ? `: ${target.Scopes}` : ""}`}
            {showTargetYear(target)}
          </span>
          {showSourceLink(target) && (
            <span className="text-sm">
              Source: <LinkWithQuery href={`/document/${target["family-slug"]}`}>{target["family-name"]}</LinkWithQuery>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};
