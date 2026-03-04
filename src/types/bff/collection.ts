import { TApiCollectionPublicWithFamilies } from "../api";
import { TCollectionPublicWithFamilies } from "../types";

export type TCollectionApiOldData = {
  collection: TApiCollectionPublicWithFamilies;
};

// TODO: fill this out when we are making new data model API calls
export type TCollectionApiNewData = null;

export type TCollectionPresentationalData = {
  collection: TCollectionPublicWithFamilies;
};

export type TCollectionPresentationalResponse = {
  data: TCollectionPresentationalData | null;
  errors: Error[];
};
