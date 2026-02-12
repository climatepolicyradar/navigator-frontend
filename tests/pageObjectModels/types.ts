export type TTextMatch = string | RegExp;

export type TTextFilter = {
  hasText?: TTextMatch;
  hasNotText?: TTextMatch;
};
