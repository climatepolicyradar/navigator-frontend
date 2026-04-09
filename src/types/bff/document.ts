import { TApiDocumentPage, TApiFamilyPublic, TApiSearchResponse } from "../api";
import { TTopics } from "../topics";
import { TCorpusTypeDictionary, TDocumentPage, TFamilyPublic, TSearchResponse } from "../types";

export type TDocumentApiOldData = {
  corpusTypes: TCorpusTypeDictionary;
  document: TApiDocumentPage;
  family: TApiFamilyPublic;
  topicsData: TTopics;
  vespaDocumentData: TApiSearchResponse;
};

// TODO: fill this out when we are making new data model API calls
export type TDocumentApiNewData = null;

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
