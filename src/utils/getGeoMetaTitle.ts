import { TTheme } from "@types";

const CPR_TITLE = "climate laws and policies";
const CCLW_TITLE = "climate laws and policies";

export const getGeoMetaTitle = (geo: string, theme: TTheme): string => {
  let title = CPR_TITLE;
  switch (theme) {
    case "cclw":
      title = CCLW_TITLE;
      break;
  }
  return `${geo} ${title}`;
};
