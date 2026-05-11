import { TDataInDocument } from "@/schemas";

import { IApiFamilyDocumentTopics, TApiSearchResponse, TApiTarget } from "../api";
import { IFamilyDocumentTopics } from "../tables/familyDocumentTopics";
import { TCollectionPublicWithFamilies, TFamilyPublic, TSearchResponse, TTarget } from "../types";

export type TFamilyApiData = {
  collections: TDataInDocument[];
  family: TDataInDocument;
  familyTopics: IApiFamilyDocumentTopics | null;
  targets: TApiTarget[];
  vespaFamilyData: TApiSearchResponse | null;
};

export type TFamilyPresentationalData = {
  collections: TCollectionPublicWithFamilies[];
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  targets: TTarget[];
  vespaFamilyData: TSearchResponse | null;
  debug?: {
    dataInDocument: TDataInDocument;
  };
};

export type TFamilyPresentationalResponse = {
  data: TFamilyPresentationalData | null;
  errors: Error[];
};
