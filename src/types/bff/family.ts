import { TDataInDocument } from "@/schemas";

import {
  IApiFamilyDocumentTopics,
  TApiCollectionPublicWithFamilies,
  TApiCorpusTypeDictionary,
  TApiFamilyPublic,
  TApiGeography,
  TApiGeographySubdivision,
  TApiSearchResponse,
} from "../api";
import { IFamilyDocumentTopics } from "../tables/familyDocumentTopics";
import { TCollectionPublicWithFamilies, TFamilyPublic, TGeography, TGeographySubdivision, TSearchResponse } from "../types";

export type TFamilyApiOldData = {
  collections: TApiCollectionPublicWithFamilies[];
  corpusTypes: TApiCorpusTypeDictionary;
  countries: TApiGeography[];
  family: TApiFamilyPublic;
  familyTopics: IApiFamilyDocumentTopics | null;
  subdivisions: TApiGeographySubdivision[];
  vespaFamilyData: TApiSearchResponse | null;
};

export type TFamilyApiNewData = TDataInDocument | null;

export type TFamilyPresentationalData = {
  collections: TCollectionPublicWithFamilies[];
  countries: TGeography[];
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  subdivisions: TGeographySubdivision[];
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
