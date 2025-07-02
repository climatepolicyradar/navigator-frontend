import { http, HttpResponse } from "msw";

export const geographiesHandlers = [
  http.get("*/geographies/", () => {
    return HttpResponse.json([
      {
        alpha_3: "BLZ",
        display_value: "Belize",
        name: "Belize",
        slug: "belize",
        type: "country",
        value: "Belize",
      },
    ]);
  }),
];
