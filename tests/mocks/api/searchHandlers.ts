import { http, HttpResponse } from "msw";

export const searchHandlers = [
  http.options("*/searches", () => {
    return new HttpResponse("", {
      status: 200,
      headers: {
        "access-control-allow-methods": "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT",
      },
    });
  }),
  http.post("*/searches", () => {
    return HttpResponse.json({
      families: [],
      total_family_hits: 0,
      continuation_token: null,
    });
  }),
];
