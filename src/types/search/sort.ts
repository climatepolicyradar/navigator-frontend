export const SORT_VALUES = ["relevance", "recent", "oldest", "title_asc", "title_desc", "page"] as const;
export type TSortValue = (typeof SORT_VALUES)[number];

export type TSortOptionConfig = {
  label: string;
  paramValue: TSortValue;
};
