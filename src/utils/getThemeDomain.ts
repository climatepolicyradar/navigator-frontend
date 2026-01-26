import { TTheme } from "@/types";

const CPR_DOMAIN = "app.climatepolicyradar.org";
const CCLW_DOMAIN = "climate-laws.org";
const MCF_DOMAIN = "climateprojectexplorer.org";
const CCC_DOMAIN = "www.climatecasechart.com";

export default function getThemeDomain(site: TTheme): string {
  let domain = CPR_DOMAIN;
  switch (site) {
    case "cclw":
      domain = CCLW_DOMAIN;
      break;
    case "mcf":
      domain = MCF_DOMAIN;
      break;
    case "ccc":
      domain = CCC_DOMAIN;
      break;
  }
  return domain;
}
