import { TDataInDocument } from "src/schemas";

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
import {
  TCollectionPublicWithFamilies,
  TCorpusTypeDictionary,
  TFamilyPublic,
  TGeography,
  TGeographySubdivision,
  TSearchResponse,
  TTarget,
} from "../types";

export type TFamilyApiOldData = {
  collections: TApiCollectionPublicWithFamilies[];
  corpus_types: TApiCorpusTypeDictionary;
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
  corpus_types: TCorpusTypeDictionary;
  countries: TGeography[];
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  subdivisions: TGeographySubdivision[];
  targets: TTarget[];
  vespaFamilyData: TSearchResponse | null;
  usesDataIn: boolean;
};

export type TFamilyPresentationalResponse = {
  data: TFamilyPresentationalData | null;
  errors: Error[];
};
