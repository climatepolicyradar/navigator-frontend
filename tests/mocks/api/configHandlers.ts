import { http, HttpResponse } from "msw";

import cprConfig from "@/cpr/config";
import { TThemeConfig } from "@/types";

let themeConfig: TThemeConfig = cprConfig;

export const setUpThemeConfig = (testThemeConfig: TThemeConfig) => {
  if (testThemeConfig) {
    themeConfig = testThemeConfig;
  }
};

export const configHandlers = [
  http.get("/api/env", () => {
    return HttpResponse.json({
      env: {
        theme: process.env.THEME,
        api_url: process.env.BACKEND_API_URL,
        app_token: process.env.BACKEND_API_TOKEN,
      },
    });
  }),
  http.get("/api/theme-config", () => {
    return HttpResponse.json(themeConfig);
  }),
  http.get("*/config", () => {
    return HttpResponse.json({
      geographies: [
        {
          node: {
            id: 1,
            display_value: "Europe & Central Asia",
            slug: "europe-central-asia",
            value: "Europe & Central Asia",
            type: "World Bank Region",
            parent_id: null,
          },
          children: [
            {
              node: {
                id: 2,
                slug: "france",
                display_value: "France",
                value: "FRA",
                type: "ISO-3166",
                parent_id: 1,
              },
              // Subdivisions
              children: [],
            },
            {
              node: {
                id: 3,
                slug: "spain",
                display_value: "Spain",
                value: "ESP",
                type: "ISO-3166",
                parent_id: 1,
              },
              // Subdivisions
              children: [],
            },
          ],
        },
        {
          node: {
            id: 4,
            display_value: "Sub-Saharan Africa",
            slug: "sub-saharan-africa",
            value: "Sub-Saharan Africa",
            type: "World Bank Region",
            parent_id: null,
          },
          children: [
            {
              node: {
                id: 5,
                slug: "south-africa",
                display_value: "South Africa",
                value: "ZAF",
                type: "ISO-3166",
                parent_id: 4,
              },
              // Subdivisions
              children: [],
            },
            {
              node: {
                id: 6,
                slug: "central-african-republic",
                display_value: "Central African Republic",
                value: "CAF",
                type: "ISO-3166",
                parent_id: 4,
              },
              // Subdivisions
              children: [],
            },
            {
              node: {
                id: 7,
                slug: "sudan",
                display_value: "Sudan",
                value: "SDN",
                type: "ISO-3166",
                parent_id: 4,
              },
              // Subdivisions
              children: [],
            },
            {
              node: {
                id: 8,
                slug: "south-sudan",
                display_value: "South Sudan",
                value: "SSD",
                type: "ISO-3166",
                parent_id: 4,
              },
              // Subdivisions
              children: [],
            },
          ],
        },
        {
          node: {
            id: 9,
            display_value: "Latin America & Caribbean",
            slug: "latin-america-caribbean",
            value: "Latin America & Caribbean",
            type: "World Bank Region",
            parent_id: null,
          },
          children: [
            {
              node: {
                id: 10,
                display_value: "Belize",
                slug: "belize",
                type: "ISO-3166",
                value: "BLZ",
                parent_id: 9,
              },
              children: [],
            },
            {
              node: {
                id: 11,
                display_value: "Argentina",
                slug: "argentina",
                value: "ARG",
                type: "ISO-3166",
                parent_id: 9,
              },
              // Subdivisions
              children: [],
            },
          ],
        },
        {
          node: {
            id: 12,
            display_value: "East Asia & Pacific",
            slug: "east-asia-pacific",
            value: "East Asia & Pacific",
            type: "World Bank Region",
            parent_id: null,
          },
          children: [
            {
              node: {
                id: 13,
                display_value: "Australia",
                slug: "australia",
                value: "AUS",
                type: "ISO-3166",
                parent_id: 12,
              },
              children: [
                {
                  node: {
                    id: 349,
                    display_value: "New South Wales",
                    slug: "au-nsw",
                    value: "AU-NSW",
                    type: "ISO-3166-2",
                    parent_id: 13,
                  },
                  children: [],
                },
                {
                  node: {
                    id: 351,
                    display_value: "Queensland",
                    slug: "au-qld",
                    value: "AU-QLD",
                    type: "ISO-3166-2",
                    parent_id: 13,
                  },
                  children: [],
                },
              ],
            },
          ],
        },
        {
          node: {
            id: 14,
            display_value: "South Asia",
            slug: "south-asia",
            value: "South Asia",
            type: "World Bank Region",
            parent_id: null,
          },
          children: [
            {
              node: {
                id: 15,
                display_value: "Afghanistan",
                slug: "afghanistan",
                value: "AFG",
                type: "ISO-3166",
                parent_id: 14,
              },
              children: [],
            },
          ],
        },
      ],
      languages: {},
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
                Reports: 0,
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
                Reports: 0,
              },
            },
          ],
        },
      },
    });
  }),
];
