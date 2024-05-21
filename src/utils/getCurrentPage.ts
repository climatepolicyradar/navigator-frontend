export const getCurrentPage = (offset: number, perPage: number, cts: string[], ct: string = "") => {
  let tokenIndex = cts.indexOf(ct);
  const page = Math.ceil(offset / perPage) + 1;
  // get the page set based on the page number
  // the token index implies the page set, then we add the calculated page based on the offet and perPage
  // console.table({ offset, perPage, cts, ct, tokenIndex, page, calculated_page: tokenIndex * 5 + page });
  return tokenIndex * 5 + page; // TODO: create variable for pages per set
};
