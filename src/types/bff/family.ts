import { TDataInDocument } from "@/schemas";

import { IApiFamilyDocumentTopics, TApiCorpusTypeDictionary, TApiGeography, TApiSearchResponse, TApiTarget } from "../api";
import { IFamilyDocumentTopics } from "../tables/familyDocumentTopics";
import { TCollectionPublicWithFamilies, TFamilyPublic, TGeographySubdivision, TSearchResponse, TTarget } from "../types";

export type TFamilyApiData = {
  collections: TDataInDocument[];
  corpusTypes: TApiCorpusTypeDictionary;
  countries: TApiGeography[];
  family: TDataInDocument;
  familyTopics: IApiFamilyDocumentTopics | null;
  targets: TApiTarget[];
  vespaFamilyData: TApiSearchResponse | null;
};

export type TFamilyPresentationalData = {
  collections: TCollectionPublicWithFamilies[];
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  subdivisions: TGeographySubdivision[];
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
