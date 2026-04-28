import { TDataInDocument } from "@/schemas";

import { TApiDocumentPublic, TApiSearchResponse } from "../api";
import { TTopics } from "../topics";
import { TFamilyDocumentPublic, TFamilyPublic, TSearchResponse } from "../types";

export type TDocumentApiOldData = {
  document: TApiDocumentPublic;
  topicsData: TTopics;
  vespaDocumentData: TApiSearchResponse;
};

export type TDocumentApiNewData = TDataInDocument | null;

export type TDocumentPresentationalData = {
  document: TFamilyDocumentPublic;
  family: TFamilyPublic;
  topicsData: TTopics;
  vespaDocumentData: TSearchResponse;
};

export type TDocumentPresentationalResponse = {
  data: TDocumentPresentationalData | null;
  errors: Error[];
};
