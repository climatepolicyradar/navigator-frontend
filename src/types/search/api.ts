interface IDocumentLabel {
  id: string;
  value: string;
  type: string;
}

export interface IDocumentLabelRelationship {
  count: number | null;
  type: string;
  value: IDocumentLabel;
  timestamp: string | null;
  document_id?: string | null;
}

export interface IDocumentRelationship {
  type: string;
  value: ISearchDocument;
}

interface IDocumentItem {
  url: string | null;
}

export interface ISearchDocument {
  id: string;
  title: string;
  description: string | null;
  labels: IDocumentLabelRelationship[];
  documents: IDocumentRelationship[];
  items: IDocumentItem[];
  attributes: Record<string, string | number | boolean>;
}

export interface ISearchDocumentResponse {
  data: ISearchDocument;
}

interface IAggregationLabel {
  count: number;
  value: {
    id: string;
    type: string;
    value: string;
  };
}

export interface ISearchDocumentsResponse {
  total_size: number | null;
  page: number;
  page_size: number;
  total_pages: number | null;
  next_page: string | null;
  previous_page: string | null;
  results: ISearchDocument[];
  aggregations?: {
    labels: IAggregationLabel[];
  };
}
