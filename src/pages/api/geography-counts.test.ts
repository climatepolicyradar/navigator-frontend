import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { NextApiRequest, NextApiResponse } from "next";

import handler from "./geography-counts";

// This can be used by any pages that make this call
export const testHandler = http.get(`/api/geographies`, () => {
  return HttpResponse.json({
    counts: {
      UNFCCC: 23,
      laws: 47,
      policies: 126,
      "climate-finance-projects": 65,
      "corporate-disclosures": 34,
      "offshore-wind-reports": 7,
    },
  });
});

export const backendApiSearchHandler = http.post(`${process.env.BACKEND_API_URL}/searches`, () => {
  return HttpResponse.json({
    hits: 23,
    total_family_hits: 23,
    query_time_ms: 18,
    total_time_ms: 19,
    continuation_token: null,
    this_continuation_token: "",
    prev_continuation_token: null,
    families: [],
  });
});

const server = setupServer(backendApiSearchHandler);
server.listen();

describe("geography-counts", () => {
  const testCases = [
    { query: {}, expectedStatus: 400 },
    { query: { c: "unfccc" }, expectedStatus: 400 },
    { query: { l: "brazil" }, expectedStatus: 400 },
    { query: { c: "unfccc", l: "brazil" }, expectedStatus: 200 },
  ];

  test.each(testCases)("query: $query results in $expectedStatus", async ({ query, expectedStatus }) => {
    const req = {
      query,
      method: "GET",
    } as NextApiRequest;

    const res = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        return this;
      },
    } as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.statusCode).toBe(expectedStatus);
  });
});
