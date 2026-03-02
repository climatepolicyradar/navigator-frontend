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
export type TFamilyApiNewData = null;

export type TFamilyApiData = TFamilyApiOldData | TFamilyApiNewData | null;

export const isOldFamilyApiData = (data: TFamilyApiData): data is TFamilyApiOldData => "corpus_types" in data; // TODO: make sure this is a good check once TFamilyApiNewData is populated

export type TFamilyPresentationalData = {
  collections: TCollectionPublicWithFamilies[];
  corpus_types: TCorpusTypeDictionary;
  countries: TGeography[];
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  subdivisions: TGeographySubdivision[];
  targets: TTarget[];
  vespaFamilyData: TSearchResponse | null;
};

export type TFamilyPresentationalResponse = {
  data: TFamilyPresentationalData | null;
  errors: Error[];
};
