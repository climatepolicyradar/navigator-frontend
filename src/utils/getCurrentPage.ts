export const getCurrentPage = (offset: number, perPage: number, pagesPerToken: number, cts: string[], ct: string = "") => {
  const tokenIndex = cts.indexOf(ct);
  // each token represents a number of pages, so we need to calculate the page based on the offset and perPage
  const tokenPage = Math.ceil(offset / perPage) + 1; // Pages are not zero-indexed
  return tokenIndex * pagesPerToken + tokenPage;
};
