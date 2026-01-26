import { http, HttpResponse } from "msw";

export const backendApiSearchHandler = [
  http.post(`${process.env.BACKEND_API_URL}/searches`, () => {
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
  }),
];
