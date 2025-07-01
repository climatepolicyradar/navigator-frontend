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
      hits: 2,
      total_family_hits: 2,
      query_time_ms: 17,
      total_time_ms: 18,
      continuation_token: null,
      this_continuation_token: "",
      prev_continuation_token: null,
      families: [
        {
          family_slug: "belize-nationally-determined-contribution-ndc3-update_8ee3",
          family_name: "Belize Nationally Determined Contribution. NDC3 (Update)",
          family_description: "<p>Belize's Third Nationally Determined Contribution NDC 3.0</p>",
          family_category: "UNFCCC",
          family_date: "2025-06-14T00:00:00+00:00",
          family_last_updated_date: "2025-06-14T00:00:00+00:00",
          family_source: "UNFCCC",
          corpus_import_id: "UNFCCC.corpus.i00000001.n0000",
          corpus_type_name: "Intl. agreements",
          family_geographies: ["BLZ"],
          family_metadata: {
            author: ["Belize"],
            author_type: ["Party"],
          },
          family_title_match: true,
          family_description_match: true,
          total_passage_hits: 1,
          family_documents: [],
          continuation_token: null,
          prev_continuation_token: null,
        },
        {
          family_slug: "belize-biennial-transparency-report-btr1_fdd9",
          family_name: "Belize Biennial Transparency Report. BTR1",
          family_description: "<p>Belize Biennial Transparency Report. BTR1</p>",
          family_category: "UNFCCC",
          family_date: "2024-12-31T00:00:00+00:00",
          family_last_updated_date: "2025-01-02T00:00:00+00:00",
          family_source: "UNFCCC",
          corpus_import_id: "UNFCCC.corpus.i00000001.n0000",
          corpus_type_name: "Intl. agreements",
          family_geographies: ["BLZ"],
          family_metadata: {
            author: ["Belize"],
            author_type: ["Party"],
          },
          family_title_match: true,
          family_description_match: true,
          total_passage_hits: 1,
          family_documents: [],
          continuation_token: null,
          prev_continuation_token: null,
        },
      ],
    });
  }),
];
