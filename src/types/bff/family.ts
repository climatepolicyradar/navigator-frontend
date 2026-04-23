import { TDataInDocument } from "@/schemas";

import {
  IApiFamilyDocumentTopics,
  TApiCollectionPublicWithFamilies,
  TApiCorpusTypeDictionary,
  TApiFamilyPublic,
  TApiGeography,
  TApiGeographySubdivision,
  TApiSearchResponse,
  TApiTarget,
} from "../api";
import { IFamilyDocumentTopics } from "../tables/familyDocumentTopics";
import { TCollectionPublicWithFamilies, TFamilyPublic, TGeography, TGeographySubdivision, TSearchResponse, TTarget } from "../types";

export type TFamilyApiOldData = {
  collections: TApiCollectionPublicWithFamilies[];
  corpusTypes: TApiCorpusTypeDictionary;
  countries: TApiGeography[];
  family: TApiFamilyPublic;
  familyTopics: IApiFamilyDocumentTopics | null;
  subdivisions: TApiGeographySubdivision[];
  targets: TApiTarget[];
  vespaFamilyData: TApiSearchResponse | null;
};

// TODO: fill this out when we are making new data model API calls
export type TFamilyApiNewData = TDataInDocument | null;

export type TFamilyPresentationalData = {
  collections: TCollectionPublicWithFamilies[];
  countries: TGeography[];
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  subdivisions: TGeographySubdivision[];
  targets: TTarget[];
  vespaFamilyData: TSearchResponse | null;
  debug?: {
    usesDataIn: boolean;
    newApiData?: TFamilyApiNewData;
    originalFamily?: TFamilyPublic;
  };
};

export type TFamilyPresentationalResponse = {
  data: TFamilyPresentationalData | null;
  errors: Error[];
};
