import { http, HttpResponse } from "msw";

export const geographiesHandlers = [
  http.get("*/geographies/", () => {
    return HttpResponse.json([
      {
        alpha_3: "BLZ",
        official_name: null,
        name: "Belize",
        alpha_2: "BZ",
      },
      {
        alpha_3: "FRA",
        official_name: "French Republic",
        name: "France",
        alpha_2: "FR",
      },
      {
        alpha_3: "ESP",
        official_name: "Kingdom of Spain",
        name: "Spain",
        alpha_2: "ES",
      },
      {
        alpha_3: "ZAF",
        official_name: "Republic of South Africa",
        name: "South Africa",
        alpha_2: "ZA",
      },
      {
        alpha_3: "CAF",
        official_name: null,
        name: "Central African Republic",
        alpha_2: "CF",
      },
      {
        alpha_3: "SDN",
        official_name: "Republic of Sudan",
        name: "Sudan",
        alpha_2: "SD",
      },
      {
        alpha_3: "SSD",
        official_name: "Republic of South Sudan",
        name: "South Sudan",
        alpha_2: "SS",
      },
    ]);
  }),
];
