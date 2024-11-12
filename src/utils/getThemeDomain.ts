import { TTheme } from "@types";

const CPR_DOMAIN = "app.climatepolicyradar.org";
const CCLW_DOMAIN = "climate-laws.org";
const MCF_DOMAIN = "climateprojectexplorer.org";

export default function getThemeDomain(site: TTheme): string {
  let domain = CPR_DOMAIN;
  switch (site) {
    case "cclw":
      domain = CCLW_DOMAIN;
      break;
    case "mcf":
      domain = MCF_DOMAIN;
      break;
  }
  return domain;
}
