import { http, HttpResponse } from "msw";

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
    return HttpResponse.json({
      categories: {
        label: "Category",
        options: [
          {
            label: "All",
            slug: "all",
          },
        ],
      },
      documentCategories: ["All"],
      filters: [
        {
          label: "Published jurisdiction",
          taxonomyKey: "country",
          options: [],
        },
      ],
      features: { knowledgeGraph: false, searchFamilySummary: false },
      metadata: [
        {
          key: "search",
          title: "Law and Policy Search",
        },
      ],
    });
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
              id: 2,
              slug: "france",
              display_value: "France",
              value: "france",
              type: "country",
              parent_id: null,
            },
            {
              id: 3,
              slug: "spain",
              display_value: "Spain",
              value: "spain",
              type: "country",
              parent_id: null,
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
              id: 5,
              slug: "south-africa",
              display_value: "South Africa",
              value: "south-africa",
              type: "country",
              parent_id: null,
            },
            {
              id: 6,
              slug: "central-african-republic",
              display_value: "Central African Republic",
              value: "central-african-republic",
              type: "country",
              parent_id: null,
            },
            {
              id: 7,
              slug: "sudan",
              display_value: "Sudan",
              value: "sudan",
              type: "country",
              parent_id: null,
            },
            {
              id: 8,
              slug: "south-sudan",
              display_value: "South Sudan",
              value: "south-sudan",
              type: "country",
              parent_id: null,
            },
          ],
        },
        {
          id: 9,
          display_value: "South Asia",
          slug: "south-asia",
          type: "World Bank Region",
          value: "South Asia",
          parent_id: null,
          children: [
            {
              id: 10,
              display_value: "Belize",
              slug: "BLZ",
              type: "country",
              value: "Belize",
              parent_id: null,
            },
            {
              node: {
                id: 140,
                display_value: "Argentina",
                slug: "argentina",
                value: "ARG",
                type: "ISO-3166",
                parent_id: 138,
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
