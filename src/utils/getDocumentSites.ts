import { TDataInLabel } from "@/schemas";
import { THEMES, TSiteDecision, TTheme, TThemeConfig, TThemeCriteria } from "@/types";
import getThemeDomain from "@/utils/getThemeDomain";

import themes from "../../themes";

export const toThemeCriteria = (labels: TDataInLabel[]): TThemeCriteria => {
  return {
    categories: labels.filter((label) => label.type === "category").map((label) => label.value.value),
    labelIds: labels.map((label) => label.value.id),
  };
};

/*
 * Order of preference for canonical links: Lower numbers win
 * So if a document is e.g. on cclw and cpr, cclw is the canonical
 *
 * These values were picked to match the behaviour of attribution_url:
 * MCF canonicalises to CPR, CPR canonicalises to partner themes
 */
const THEME_PRIORITY: Record<TTheme, number> = {
  cclw: 0,
  ccc: 1,
  cpr: 2,
  mcf: 3,
};

const inSearchCategory = (themeConfig: TThemeConfig, document: TThemeCriteria): boolean => {
  return themeConfig.searchCategories.some((category) => document.categories.includes(category));
};

const excludedByLabel = (themeConfig: TThemeConfig, document: TThemeCriteria): boolean => {
  return themeConfig.searchExcludeLabels.some(({ id }) => document.labelIds.includes(id));
};

const serves = (themeConfig: TThemeConfig, document: TThemeCriteria): boolean => {
  return inSearchCategory(themeConfig, document) && !excludedByLabel(themeConfig, document);
};

export const getDocumentSites = (document: TThemeCriteria): TTheme[] => {
  return THEMES.filter((theme) => serves(themes[theme], document));
};

export const getCanonicalSite = (document: TThemeCriteria): TTheme | null => {
  const sites = getDocumentSites(document).sort((a, b) => THEME_PRIORITY[a] - THEME_PRIORITY[b]);
  return sites[0] ?? null;
};

/**
 * Given a document we've just been directly linked to, figure out what to do with it.
 *
 * - If the document is not served by this theme, we need to redirect it to another.
 * - If it's served by many themes, we need to choose a canonical URL (ideally a partner).
 * - If it isn't served by any theme we should 404, which is a rare case.
 */
export const getSiteDecision = (document: TThemeCriteria, theme: TTheme, path: string): TSiteDecision => {
  const canonicalSite = getCanonicalSite(document);

  if (canonicalSite === null) {
    return { action: "not_found" };
  }

  const canonicalUrl = `https://${getThemeDomain(canonicalSite)}${path}`;

  if (getDocumentSites(document).includes(theme)) {
    return { action: "serve", canonicalUrl };
  }

  return { action: "redirect", destination: canonicalUrl };
};
