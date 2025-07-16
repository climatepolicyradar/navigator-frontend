import { http, HttpResponse } from "msw";

export const geographiesHandlers = [
  http.get("*/geographies/", () => {
    return HttpResponse.json([
      {
        alpha_2: "AR",
        alpha_3: "ARG",
        name: "Argentina",
        official_name: "Argentine Republic",
        numeric: "032",
        flag: "🇦🇷",
      },
      {
        alpha_3: "BLZ",
        display_value: "Belize",
        name: "Belize",
        slug: "belize",
        type: "country",
        value: "Belize",
      },
      {
        alpha_2: "CU",
        alpha_3: "CUB",
        name: "Cuba",
        official_name: "Republic of Cuba",
        numeric: "192",
        flag: "🇨🇺",
      },
    ]);
  }),
];
