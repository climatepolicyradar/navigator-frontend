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
            display_value: "South Asia",
            slug: "south-asia",
            type: "region",
            value: "South Asia",
          },
          children: [
            {
              node: {
                display_value: "Afghanistan",
                slug: "AFG",
                type: "country",
                value: "Afghanistan",
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
              },
            },
          ],
        },
      },
    });
  }),
];
