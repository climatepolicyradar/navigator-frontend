import { TDataInDocument } from "@/schemas";

import { IFamilyDocumentTopics } from "../tables/familyDocumentTopics";
import { TThemeCriteria } from "../theme";
import { TCollectionPublicWithFamilies, TFamilyPublic } from "../types";

export type TFamilyApiData = {
  collections: TDataInDocument[];
  family: TDataInDocument;
  familyTopics: IFamilyDocumentTopics | null;
};

export type TFamilyPresentationalData = {
  collections: TCollectionPublicWithFamilies[];
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  themeCriteria: TThemeCriteria;
  debug?: {
    dataInDocument: TDataInDocument;
  };
};

export type TFamilyPresentationalResponse = {
  data: TFamilyPresentationalData | null;
  errors: Error[];
};
