import { TDataInDocument } from "@/schemas";

import { ISearchDocument } from "../search/api";
import { TThemeCriteria } from "../theme";
import { TTopics } from "../topics";
import { TFamilyDocumentPublic, TFamilyPublic } from "../types";

export type TDocumentApiData = {
  document: TDataInDocument;
  topicsData?: TTopics;
  searchDocument?: ISearchDocument;
};

export type TDocumentPresentationalData = {
  document: TFamilyDocumentPublic;
  family: TFamilyPublic;
  topicsData?: TTopics;
  searchDocument?: ISearchDocument;
  themeCriteria: TThemeCriteria;
  debug?: {
    dataInDocument: TDataInDocument;
  };
};

export type TDocumentPresentationalResponse = {
  data: TDocumentPresentationalData | null;
  errors: Error[];
};
