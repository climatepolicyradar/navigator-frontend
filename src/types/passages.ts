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

export interface ISearchPassage {
  id: string;
  text_block_id: string;
  idx: number;
  text: string;
  language: string | null;
  type: string;
  type_confidence: number;
  page_number: number;
  pages: number[];
  pages_with_bounding_boxes: IPassagePageWithBoundingBoxes[];
  concepts: unknown[];
  heading_id: string | null;
  heading_text: string | null;
  document_id: string;
  principal_id: string;
  tokens: string[];
  labels: IPassageLabel[] | null;
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

export interface ISearchPassagesParams {
  query: string;
  documents: string[];
  pageSize?: number;
  // 1-indexed page number. The API's `page` parameter is currently ignored, and its
  // `next_page` / `total_pages` fields come back null, so callers page by incrementing
  // this and comparing the running result count against `total_size`.
  pageToken?: number;
  signal?: AbortSignal;
}
