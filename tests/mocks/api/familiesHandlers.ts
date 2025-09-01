import { http, HttpResponse } from "msw";

const familiesWithDocumentCounts = {
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
  ],
};

export const familiesHandlers = [
  http.get("*/families/aggregations/by-geography", () => {
    return HttpResponse.json(familiesWithDocumentCounts);
  }),
];
