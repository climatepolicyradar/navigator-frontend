import { TDataInDocument } from "@/schemas";

import { IApiFamilyDocumentTopics, TApiSearchResponse } from "../api";
import { IFamilyDocumentTopics } from "../tables/familyDocumentTopics";
import { TCollectionPublicWithFamilies, TFamilyPublic, TSearchResponse } from "../types";

export type TFamilyApiData = {
  collections: TDataInDocument[];
  family: TDataInDocument;
  familyTopics: IApiFamilyDocumentTopics | null;
  vespaFamilyData: TApiSearchResponse | null;
};

export type TFamilyPresentationalData = {
  collections: TCollectionPublicWithFamilies[];
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  vespaFamilyData: TSearchResponse | null;
  debug?: {
    dataInDocument: TDataInDocument;
  };
};

export type TFamilyPresentationalResponse = {
  data: TFamilyPresentationalData | null;
  errors: Error[];
};
