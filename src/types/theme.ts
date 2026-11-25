export type TMenuLink = {
  text: string;
  href: string;
  external: boolean;
  cy: string;
};

export type TThemeCriteria = {
  categories: string[];
  labelIds: string[];
};

type TNotFoundDecision = { action: "not_found" };
type TServeDecision = { action: "serve"; canonicalUrl: string };
type TRedirectDecision = { action: "redirect"; destination: string };
export type TSiteDecision = TServeDecision | TRedirectDecision | TNotFoundDecision;
