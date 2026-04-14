const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const getFamilyMetaDescription = (summary: string, geo: string, taxonomy: string) => {
  return `${geo} | ${taxonomy} | ${stripHtml(summary).substring(0, 600)}`;
};
