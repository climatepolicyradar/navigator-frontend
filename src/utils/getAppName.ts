import { TTheme } from "@types";

const DEFAULT_APP_NAME = "Climate Policy Radar";

export default function getPageTitle(site: TTheme): string {
  let title = DEFAULT_APP_NAME;
  switch (site) {
    case "cclw":
      title = "Climate Change Laws of the World";
      break;
    case "mcf":
      title = "Climate Project Explorer";
      break;
  }
  return title;
}
