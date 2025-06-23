import { http, HttpResponse } from "msw";

export const configHandlers = [
  http.get("/api/env", ({ request }) => {
    return { response: "json" };
    return HttpResponse.json({
      corpus_types: {
        corpus_type1: {
          corpora: [
            {
              total: 2,
              count_by_category: {
                Executive: 1,
                Legislative: 1,
                UNFCCC: 1,
                MCF: 0,
              },
            },
          ],
        },
        corpus_type2: {
          corpora: [
            {
              total: 2,
              count_by_category: {
                Executive: 2,
                Legislative: 1,
                UNFCCC: 3,
                MCF: 0,
              },
            },
          ],
        },
      },
    });
  }),
];
