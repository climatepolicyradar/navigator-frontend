import { TDataInDocument } from "@/schemas";

import { TCollectionPublicWithFamilies } from "../types";

export type TCollectionApiData = {
  collection: TDataInDocument;
  families: TDataInDocument[];
};

type TCollectionPresentationalData = {
  collection: TCollectionPublicWithFamilies;
  debug?: {
    dataInDocument: TDataInDocument;
  };
};

export type TCollectionPresentationalResponse = {
  data: TCollectionPresentationalData | null;
  errors: Error[];
};
