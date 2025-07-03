import { http, HttpResponse } from "msw";

import { getFilteredFamilies } from "@/mocks/repository";
import { TSearchCriteria } from "@/types";

export const searchHandlers = [
  http.options("*/searches", () => {
    return new HttpResponse("", {
      status: 200,
      headers: {
        "access-control-allow-methods": "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT",
      },
    });
  }),
  http.post("*/searches", async ({ request }) => {
    const body = (await request.json()) as TSearchCriteria;

    const filteredFamilies = getFilteredFamilies(body.keyword_filters);

    return HttpResponse.json({
      hits: 2,
      total_family_hits: 2,
      query_time_ms: 17,
      total_time_ms: 18,
      continuation_token: null,
      this_continuation_token: "",
      prev_continuation_token: null,
      families: filteredFamilies,
    });
  }),
];
