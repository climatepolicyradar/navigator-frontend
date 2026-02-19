import { TApiCollectionPublicWithFamilies } from "../api";
import { TCollectionPublicWithFamilies } from "../types";

export type TCollectionApiOldData = {
  collection: TApiCollectionPublicWithFamilies;
};

// TODO: fill this out when we are making new data model API calls
export type TCollectionApiNewData = null;

export type TCollectionApiData = TCollectionApiOldData | TCollectionApiNewData | null;

export const isOldCollectionApiData = (data: TCollectionApiData): data is TCollectionApiOldData => "collection" in data; // TODO: make sure this is a good check once TCollectionApiNewData is populated

export type TCollectionPresentationalData = {
  collection: TCollectionPublicWithFamilies;
};

export type TCollectionPresentationalResponse = {
  data: TCollectionPresentationalData | null;
  errors: Error[];
};
