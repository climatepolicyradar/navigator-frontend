import { ISearchDocument, ISearchDocumentsResponse, TFamilySummary } from "@/types";
import { formatDate } from "@/utils/timedate";

const principalToSummary = (principal: ISearchDocument): TFamilySummary => {
  const labelValue = (type: string): string | undefined => principal.labels.find((label) => label.value.type === type)?.value.value;
  const publishedDate = principal.attributes.published_date;

  // Build a card from a new search principal.
  return {
    href: `/document/${principal.attributes.deprecated_slug}`,
    title: principal.title,
    metadata: [
      labelValue("category"),
      labelValue("subdivision") ?? labelValue("country"),
      publishedDate && formatDate(String(publishedDate))[0].toString(),
    ].filter((line) => Boolean(line)),
  };
};

export type TCategoryResults = {
  families: TFamilySummary[];
  count: number;
};

export const toCategoryResults = (results: ISearchDocumentsResponse | undefined): TCategoryResults => {
  if (!results) return { families: [], count: 0 };
  return { families: results.results.map(principalToSummary), count: results.total_size ?? 0 };
};
