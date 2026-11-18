import { TDataInDocument } from "@/schemas";

import { TThemeCriteria } from "../theme";
import { TFamilyDocumentPublic, TFamilyPublic } from "../types";

export type TDocumentApiData = {
  document: TDataInDocument;
};

export type TDocumentPresentationalData = {
  document: TFamilyDocumentPublic;
  family: TFamilyPublic;
  themeCriteria: TThemeCriteria;
  debug?: {
    dataInDocument: TDataInDocument;
  };
};

export type TDocumentPresentationalResponse = {
  data: TDocumentPresentationalData | null;
  errors: Error[];
};
