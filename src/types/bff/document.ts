import { TDataInDocument } from "@/schemas";

import { TApiSearchResponse } from "../api";
import { TTopics } from "../topics";
import { TFamilyDocumentPublic, TFamilyPublic, TSearchResponse } from "../types";

export type TDocumentApiData = {
  document: TDataInDocument;
  topicsData: TTopics;
  vespaDocumentData: TApiSearchResponse;
};

export type TDocumentPresentationalData = {
  document: TFamilyDocumentPublic;
  family: TFamilyPublic;
  topicsData: TTopics;
  vespaDocumentData: TSearchResponse;
  debug?: {
    dataInDocument: TDataInDocument;
  };
};

export type TDocumentPresentationalResponse = {
  data: TDocumentPresentationalData | null;
  errors: Error[];
};
