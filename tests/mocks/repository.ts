const families = [
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
    family_slug: "argentina-biennial-transparency-report-btr1_19b7",
    family_name: "Argentina Biennial Transparency Report. BTR1",
    family_description: "<p>Argentina Biennial Transparency Report. BTR1</p>",
    family_category: "UNFCCC",
    family_date: "2024-12-19T00:00:00+00:00",
    family_last_updated_date: "2024-12-19T00:00:00+00:00",
    family_source: "UNFCCC",
    corpus_import_id: "UNFCCC.corpus.i00000001.n0000",
    corpus_type_name: "Intl. agreements",
    family_geographies: ["ARG"],
    family_metadata: {
      author: ["Argentina"],
      author_type: ["Party"],
    },
    family_title_match: true,
    family_description_match: true,
    total_passage_hits: 2,
    family_documents: [],
    continuation_token: null,
    prev_continuation_token: null,
  },
  {
    family_slug: "cuba-national-inventory-report-nir-2024_7430",
    family_name: "Cuba National Inventory Report (NIR). 2024",
    family_description: "<p>Cuba National Inventory Report (NIR). 2024</p>",
    family_category: "UNFCCC",
    family_date: "2025-03-31T00:00:00+00:00",
    family_last_updated_date: "2025-04-01T00:00:00+00:00",
    family_source: "UNFCCC",
    corpus_import_id: "UNFCCC.corpus.i00000001.n0000",
    corpus_type_name: "Intl. agreements",
    family_geographies: ["CUB"],
    family_metadata: {
      author: ["Cuba"],
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
    family_slug:
      "technical-analysis-of-the-first-biennial-update-report-of-afghanistan-submitted-on-13-october-2019-summary-report-by-the-team-of-technical-experts_2bb5",
    family_name:
      "Technical analysis of the first biennial update report of Afghanistan submitted on 13 October 2019. Summary report by the team of technical experts",
    family_description:
      "Technical analysis of the first biennial update report of Afghanistan submitted on 13 October 2019. Summary report by the team of technical experts, Technical Analysis Summary Report from UNFCCC Secretariat in 2020",
    family_category: "UNFCCC",
    family_date: "2020-11-13T00:00:00+00:00",
    family_last_updated_date: "2020-11-13T00:00:00+00:00",
    family_source: "UNFCCC",
    corpus_import_id: "UNFCCC.corpus.i00000001.n0000",
    corpus_type_name: "Intl. agreements",
    family_geographies: ["AFG"],
    family_metadata: {
      author: ["UNFCCC Secretariat"],
      author_type: ["Non-Party"],
    },
    family_title_match: true,
    family_description_match: true,
    total_passage_hits: 1,
    family_documents: [],
    continuation_token: null,
    prev_continuation_token: null,
  },
];

const getFilteredFamilies = (filters: any) => {
  if (filters.countries) {
    const filteredFamilies = [];
    filters.countries.forEach((country: string) => {
      const filteredFamily = families.filter((family) => {
        return family.family_geographies.includes(country);
      });
      filteredFamilies.push(...filteredFamily);
    });
    return filteredFamilies;
  }
  return families;
};

export { getFilteredFamilies };
