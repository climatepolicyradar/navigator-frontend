import { TTheme } from "@types";
const CPR_DOMAIN = "climatepolicyradar.com";
const CCLW_DOMAIN = "climate-laws.org";

export default function getPageDescription(site: TTheme): string {
  let domain = CPR_DOMAIN;
  switch (site) {
    case "cclw":
      domain = CCLW_DOMAIN;
      break;
  }
  return domain;
}
