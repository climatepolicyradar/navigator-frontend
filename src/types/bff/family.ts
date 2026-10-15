import { TDataInDocument } from "@/schemas";

import { IApiFamilyDocumentTopics } from "../api";
import { IFamilyDocumentTopics } from "../tables/familyDocumentTopics";
import { TCollectionPublicWithFamilies, TFamilyPublic } from "../types";

export type TFamilyApiData = {
  collections: TDataInDocument[];
  family: TDataInDocument;
  familyTopics: IApiFamilyDocumentTopics | null;
};

export type TFamilyPresentationalData = {
  collections: TCollectionPublicWithFamilies[];
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  debug?: {
    dataInDocument: TDataInDocument;
  };
};

export type TFamilyPresentationalResponse = {
  data: TFamilyPresentationalData | null;
  errors: Error[];
};
