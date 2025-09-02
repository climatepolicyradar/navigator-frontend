import { http, HttpResponse } from "msw";

const defaultFamiliesWithDocumentCounts = {
  data: [
    {
      code: "USA",
      name: "United States",
      type: "ISO-3166",
      count: 12747,
    },
    {
      code: "US-DC",
      name: "District of Columbia",
      type: "ISO-3166-2",
      count: 3133,
    },
    {
      code: "US-CA",
      name: "California",
      type: "ISO-3166-2",
      count: 1952,
    },
    {
      code: "XAA",
      name: "No Geography",
      type: "ISO-3166 CPR Extension",
      count: 1612,
    },
    {
      code: "BRA",
      name: "Brazil",
      type: "ISO-3166",
      count: 793,
    },
    {
      code: "AUS",
      name: "Australia",
      type: "ISO-3166",
      count: 401,
    },
    {
      code: "AU-NSW",
      name: "New South Wales",
      type: "ISO-3166-2",
      count: 62,
    },
    {
      code: "AU-QLD",
      name: "Queensland",
      type: "ISO-3166-2",
      count: 7,
    },
  ],
};

export const publishedFamiliesWithDocumentCounts = {
  data: [
    {
      code: "US-DC",
      name: "District of Columbia",
      type: "ISO-3166-2",
      count: 3133,
    },
    {
      code: "US-CA",
      name: "California",
      type: "ISO-3166-2",
      count: 1952,
    },
    {
      code: "AU-NSW",
      name: "New South Wales",
      type: "ISO-3166-2",
      count: 62,
    },
  ],
};

export const testCorpusPublishedFamiliesWithDocumentCounts = {
  data: [
    {
      code: "US-DC",
      name: "District of Columbia",
      type: "ISO-3166-2",
      count: 3133,
    },
    {
      code: "US-CA",
      name: "California",
      type: "ISO-3166-2",
      count: 1952,
    },
  ],
};

export const familiesHandlers = [
  http.get("*/families/aggregations/by-geography", ({ request }) => {
    const url = new URL(request.url);
    const document_status = url.searchParams.get("documents.document_status");
    const corpus_import_id = url.searchParams.get("corpus.import_id");

    if (corpus_import_id === "Test.corpus.n0000") {
      return HttpResponse.json(testCorpusPublishedFamiliesWithDocumentCounts);
    }

    if (document_status === "published") {
      return HttpResponse.json(publishedFamiliesWithDocumentCounts);
    }

    return HttpResponse.json(defaultFamiliesWithDocumentCounts);
  }),
];
