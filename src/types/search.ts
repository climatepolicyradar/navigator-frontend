import { TQueryParams } from "@/constants/queryParams";

export type TSuggestedSearch = {
  label: string;
  params: Partial<Record<TQueryParams, string>>;
};
