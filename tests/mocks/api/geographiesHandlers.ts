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
