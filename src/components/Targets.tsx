import { TTarget } from "@types";

// TODO: move into separate file
type TTargets = {
  targets: TTarget[];
};

export const Targets = ({ targets }: TTargets) => {
  if (!targets.length) return null;

  return (
    <ul className="ml-4 list-disc list-outside">
      {targets.map((target) => (
        <li className="mb-4" key={target.target}>
          <span className="text-blue-700">{target.target}</span>
          <span className="block text-grey-700">
            {target.group} | Base year: {target.base_year} | Target year: {target.target_year}
          </span>
        </li>
      ))}
    </ul>
  );
};
