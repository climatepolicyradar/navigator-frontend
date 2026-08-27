import { TSearchQueryGroup } from "@/types";

export type TSearchLevel = "base" | "principal" | "document";
export type TNestedSearchLevel = Exclude<TSearchLevel, "base">;

export type TSearchParamKeys = {
  documents: string;
  filters: string;
  pageToken: string;
  query: string;
  sort: string;
};

export type TSearchLevelValues = {
  documents: string[] | null;
  filters: TSearchQueryGroup | null;
  query: string | null;
  sort: string | null;
};
