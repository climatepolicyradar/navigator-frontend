import { TDataInDocument } from "@/schemas";

import { TApiCollectionPublicWithFamilies } from "../api";
import { TCollectionPublicWithFamilies } from "../types";

export type TCollectionApiOldData = {
  collection: TApiCollectionPublicWithFamilies;
};

// TODO: fill this out when we are making new data model API calls
export type TCollectionApiNewData = {
  collection: TDataInDocument | null;
  families: TDataInDocument[] | null;
};

export type TCollectionPresentationalData = {
  collection: TCollectionPublicWithFamilies;
  debug?: {
    usesDataIn: boolean;
    newApiData?: TCollectionApiNewData;
    originalCollection?: TApiCollectionPublicWithFamilies;
  };
};

export type TCollectionPresentationalResponse = {
  data: TCollectionPresentationalData | null;
  errors: Error[];
};
