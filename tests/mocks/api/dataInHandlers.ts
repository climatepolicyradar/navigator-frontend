import { http, HttpResponse } from "msw";

/* Geography label counts as returned by data-in-api, keyed by prefixed label id. */
export const publishedSubdivisionLabelCounts = [
  {
    id: "subdivision::US-DC",
    name: "District of Columbia",
    type: "subdivision",
    count: 3133,
  },
  {
    id: "subdivision::US-CA",
    name: "California",
    type: "subdivision",
    count: 1952,
  },
  {
    id: "subdivision::MX-TAB",
    name: "Tabasco",
    type: "subdivision",
    count: 4,
  },
];

export const publishedSubdivisionsWithDocumentCounts = [
  {
    code: "US-DC",
    name: "District of Columbia",
    type: "subdivision",
    count: 3133,
  },
  {
    code: "US-CA",
    name: "California",
    type: "subdivision",
    count: 1952,
  },
  {
    code: "MX-TAB",
    name: "Tabasco",
    type: "subdivision",
    count: 4,
  },
];

export const dataInHandlers = [
  http.get("*/data-in/documents:aggregateByGeography", ({ request }) => {
    const url = new URL(request.url);
    const documentStatus = url.searchParams.get("attributes.status");
    const geographyTypes = url.searchParams.getAll("labels.value.type");

    if (documentStatus !== "published" || !geographyTypes.includes("subdivision")) {
      return HttpResponse.json({ data: [] });
    }

    return HttpResponse.json({ data: publishedSubdivisionLabelCounts });
  }),
];
