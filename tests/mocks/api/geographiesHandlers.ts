import { http, HttpResponse } from "msw";

const subdivisions = [
  {
    code: "AU-NSW",
    name: "New South Wales",
    type: "State",
    country_alpha_2: "AU",
    country_alpha_3: "AUS",
  },
  {
    code: "AR-B",
    name: "Buenos Aires",
    type: "Province",
    country_alpha_2: "AR",
    country_alpha_3: "ARG",
  },
  {
    code: "CU-12",
    name: "Granma",
    type: "Province",
    country_alpha_2: "CU",
    country_alpha_3: "CUB",
  },
];

export const geographiesHandlers = [
  http.get("*/geographies/subdivisions", () => {
    return HttpResponse.json(subdivisions);
  }),
  http.get("*/geographies/subdivisions/:id", ({ params }) => {
    const { id } = params;

    return HttpResponse.json(subdivisions.find((s) => s.country_alpha_3 === id));
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
        numeric: "036",
        flag: "🇦🇺",
      },
      {
        alpha_2: "BZ",
        alpha_3: "BLZ",
        name: "Belize",
        official_name: "Belize",
        numeric: "084",
        flag: "🇧🇿",
      },
      {
        alpha_2: "FR",
        alpha_3: "FRA",
        name: "France",
        official_name: "French Republic",
      },
      {
        alpha_2: "ES",
        alpha_3: "ESP",
        name: "Spain",
        official_name: "Kingdom of Spain",
      },
      {
        alpha_2: "ZA",
        alpha_3: "ZAF",
        name: "South Africa",
        official_name: "Republic of South Africa",
      },
      {
        alpha_2: "CF",
        alpha_3: "CAF",
        name: "Central African Republic",
        official_name: null,
      },
      {
        alpha_2: "SD",
        alpha_3: "SDN",
        name: "Sudan",
        official_name: "Republic of Sudan",
      },
      {
        alpha_2: "SS",
        alpha_3: "SSD",
        name: "South Sudan",
        official_name: "Republic of South Sudan",
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
