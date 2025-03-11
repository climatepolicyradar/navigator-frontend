import { TTheme } from "@/types";

const DEFAULT_APP_NAME = "Climate Policy Radar";

export const getAppTitle = (site: TTheme, contextTheme?: TTheme) => {
  let title = DEFAULT_APP_NAME;

  const theme = site ?? contextTheme;

  switch (theme) {
    case "cclw":
      title = "Climate Change Laws of the World";
      break;
    case "mcf":
      title = "Climate Project Explorer";
      break;
  }
  return title;
};
