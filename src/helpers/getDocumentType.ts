// Naming convention comes from the previous type of TDocumentContentType
export const getDocumentType = (t: string) => {
  if (!t) return null;
  switch (t) {
    case "application/pdf":
      return "PDF";
    case "text/html":
      return "HTML";
  }
  return null;
};
