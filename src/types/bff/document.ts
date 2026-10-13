import { SearchDocument } from "@/api/search";
import { TDataInDocument } from "@/schemas";

import { TTopics } from "../topics";
import { TFamilyDocumentPublic, TFamilyPublic } from "../types";

export type TDocumentApiData = {
  document: TDataInDocument;
  topicsData?: TTopics;
  searchDocument?: SearchDocument;
};

export type TDocumentPresentationalData = {
  document: TFamilyDocumentPublic;
  family: TFamilyPublic;
  topicsData?: TTopics;
  searchDocument?: SearchDocument;
  debug?: {
    dataInDocument: TDataInDocument;
  };
};

export type TDocumentPresentationalResponse = {
  data: TDocumentPresentationalData | null;
  errors: Error[];
};
