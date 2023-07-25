import { TTarget } from "@types";
import { LinkWithQuery } from "./LinkWithQuery";

type TTargets = {
  targets: TTarget[];
  showFamilyInfo?: boolean;
};

export const Targets = ({ targets = [], showFamilyInfo = false }: TTargets) => {
  if (!targets.length) return null;

  const showSourceLink = (target: TTarget) => {
    if (!target["family-slug"] || !target["family-name"]) return false;
    if (target["family-slug"] === "" || target["family-name"] === "") return false;
    return showFamilyInfo;
  };

  return (
    <ul className="ml-4 list-disc list-outside" data-cy="targets">
      {targets.map((target) => (
        <li className="mb-4" key={target.ID}>
          <span dangerouslySetInnerHTML={{ __html: target.Description }} />
          <span className="block text-gray-500">
            {`${target.Sector}${target.Scopes !== "" ? `: ${target.Scopes}` : ""}`} | Target year: {target.Year}
          </span>
          {showSourceLink(target) && (
            <span className="block text-gray-500">
              Source: <LinkWithQuery href={`/document/${target["family-slug"]}`}>{target["family-name"]}</LinkWithQuery>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

// Ordering TBC:
// source = plan, law, framework, strategy, policy
// law above others
