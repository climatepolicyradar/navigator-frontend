export const DOCUMENT_CATEGORIES = ["All", "Legislation", "Policies", "Intl. agreements", "Litigation"];

// For now all individual fund documents are returning as MCF, so we do not need separate categories
export const MCF_DOCUMENT_CATEGORIES = ["All"];

export type TDocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];
