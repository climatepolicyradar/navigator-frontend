import { TSearchQueryGroup, TSortValue } from "@/types";

export interface IPassageBoundingBox {
  coordinates: { x: number; y: number }[];
}

export interface IPassagePageWithBoundingBoxes {
  number: number;
  bounding_boxes: IPassageBoundingBox[];
}

export interface IPassageLabel {
  classifier_id: string;
  end_index: number;
  labelled_text: string;
  labellers: string[];
  start_index: number;
  value: {
    id: string;
    type: string;
    value: string;
  };
}

export interface IPassageBolding {
  start_index: number;
  end_index: number;
  labelled_text: string;
}

export interface ISearchPassage {
  boldings: IPassageBolding[];
  id: string;
  text_block_id: string;
  idx: number;
  text: string;
  labels: IPassageLabel[] | null;
  language: string | null;
  type: string;
  type_confidence: number;
  page_number: number;
  pages: number[];
  pages_with_bounding_boxes: IPassagePageWithBoundingBoxes[];
  heading_id: string | null;
  heading_text: string | null;
  document_id: string;
  principal_id: string;
  tokens: string[];
}

export interface ISearchPassagesResponse {
  took_ms: number | null;
  total_size: number | null;
  page: number;
  page_size: number;
  total_pages: number | null;
  next_page: string | null;
  previous_page: string | null;
  results: ISearchPassage[];
}

export type TPassagesScope = { kind: "documents"; documentIds: [string, ...string[]] } | { kind: "principal"; principalId: string };

export interface ISearchPassagesParams {
  // API gateway base URL, from `useEnvConfig().API_URL` at the call site.
  apiUrl: string;
  query: string;
  scope: TPassagesScope;
  filters?: TSearchQueryGroup | null;
  pageSize?: number;
  // 1-indexed page number. The API's `page` parameter is currently ignored, and its
  // `next_page` / `total_pages` fields come back null, so callers page by incrementing
  // this and comparing the running result count against `total_size`.
  pageToken?: number;
  signal?: AbortSignal;
  sort?: TSortValue;
}
