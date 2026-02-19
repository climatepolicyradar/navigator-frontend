import { TApiDocumentPage, TApiFamilyPublic, TApiSearchResponse } from "../api";
import { TTopics } from "../topics";
import { TDocumentPage, TFamilyPublic, TSearchResponse } from "../types";

export type TDocumentApiOldData = {
  document: TApiDocumentPage;
  family: TApiFamilyPublic;
  topicsData: TTopics;
  vespaDocumentData: TApiSearchResponse;
};

// TODO: fill this out when we are making new data model API calls
export type TDocumentApiNewData = null;

export type TDocumentApiData = TDocumentApiOldData | TDocumentApiNewData | null;

export const isOldDocumentApiData = (data: TDocumentApiData): data is TDocumentApiOldData => "vespaDocumentData" in data; // TODO: make sure this is a good check once TDocumentApiNewData is populated

export type TDocumentPresentationalData = {
  document: TDocumentPage;
  family: TFamilyPublic;
  topicsData: TTopics;
  vespaDocumentData: TSearchResponse;
};

export type TDocumentPresentationalResponse = {
  data: TDocumentPresentationalData | null;
  errors: Error[];
};
