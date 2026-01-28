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

export const testCorpus1FamiliesWithSubdivisionCounts = [
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
];

export const testCorpus2FamiliesWithSubdivisionCounts = [
  {
    code: "US-MI",
    name: "Michigan",
    type: "ISO-3166-2",
    count: 17,
  },
];

const testCorpus3FamiliesWithSubdivisionCounts = [
  {
    code: "AU-NSW",
    name: "New South Wales",
    type: "ISO-3166-2",
    count: 62,
  },
];

const familyCountsPerCorpus: Record<string, typeof testCorpus1FamiliesWithSubdivisionCounts> = {
  "Test.corpus.n0000": testCorpus1FamiliesWithSubdivisionCounts,
  "Test.corpus.n0001": testCorpus2FamiliesWithSubdivisionCounts,
  "Test.corpus.n0002": testCorpus3FamiliesWithSubdivisionCounts,
};

export const allPublishedFamiliesWithDocumentCounts = {
  data: [...testCorpus1FamiliesWithSubdivisionCounts, ...testCorpus2FamiliesWithSubdivisionCounts, ...testCorpus3FamiliesWithSubdivisionCounts],
};

export const familiesHandlers = [
  http.get("*/families/aggregations/by-geography", ({ request }) => {
    const url = new URL(request.url);
    const document_status = url.searchParams.get("documents.document_status");
    const corpora = url.searchParams.getAll("corpus.import_id");

    if (corpora.length > 0) {
      const familyCounts = corpora.flatMap((corpus) => familyCountsPerCorpus[corpus] ?? []).filter((v) => v !== null);
      if (familyCounts.length > 0) {
        return HttpResponse.json({ data: familyCounts });
      }
    }

    if (document_status === "published") {
      return HttpResponse.json(allPublishedFamiliesWithDocumentCounts);
    }

    return HttpResponse.json(defaultFamiliesWithDocumentCounts);
  }),
];
