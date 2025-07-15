import { http, HttpResponse } from "msw";

export const geographiesHandlers = [
  http.get("*/geographies/subdivisions", () => {
    return HttpResponse.json([
      {
        code: "AU-NSW",
        name: "New South Wales",
        type: "State",
        country_alpha_2: "AU",
        country_alpha_3: "AUS",
      },
    ]);
  }),
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
        alpha_2: "AU",
        alpha_3: "AUS",
        name: "Australia",
        official_name: "Australia",
        numeric: "",
        flag: "",
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
