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
    family_slug: "family-with-topic-1-btr1_17c7",
    family_name: "Family with topic 1",
    family_description: "<p>Family with topic 1</p>",
    family_category: "UNFCCC",
    family_date: "2024-12-19T00:00:00+00:00",
    family_last_updated_date: "2024-12-19T00:00:00+00:00",
    family_source: "UNFCCC",
    corpus_import_id: "UNFCCC.corpus.i00000001.n0000",
    corpus_type_name: "Intl. agreements",
    family_geographies: ["USA"],
    family_metadata: {
      author: ["USA"],
      author_type: ["Party"],
    },
    family_title_match: true,
    family_description_match: true,
    total_passage_hits: 2,
    family_documents: [
      {
        document_passage_matches: {
          concepts: [
            {
              id: "1",
              name: "child topic 1",
              parent_concepts: [
                {
                  name: "",
                  id: "Q1651",
                },
              ],
              parent_concept_ids_flat: "Q1651,",
              model: "",
              end: 776,
              start: 0,
              timestamp: "2025-05-27T11:51:54.039195",
            },
          ],
        },
      },
    ],
    continuation_token: null,
    prev_continuation_token: null,
  },
  {
    family_slug: "family-with-topic-2-btr1_17c78",
    family_name: "Family with topic 2",
    family_description: "<p>Family with topic 2</p>",
    family_category: "UNFCCC",
    family_date: "2024-12-19T00:00:00+00:00",
    family_last_updated_date: "2024-12-19T00:00:00+00:00",
    family_source: "UNFCCC",
    corpus_import_id: "UNFCCC.corpus.i00000001.n0000",
    corpus_type_name: "Intl. agreements",
    family_geographies: ["USA"],
    family_metadata: {
      author: ["USA"],
      author_type: ["Party"],
    },
    family_title_match: true,
    family_description_match: true,
    total_passage_hits: 2,
    family_documents: [
      {
        document_passage_matches: {
          concepts: [
            {
              id: "2",
              name: "child topic 2",
              parent_concepts: [
                {
                  name: "",
                  id: "Q1651",
                },
              ],
              parent_concept_ids_flat: "Q1651,",
              model: "",
              end: 776,
              start: 0,
              timestamp: "2025-05-27T11:51:54.039195",
            },
          ],
        },
      },
    ],
    continuation_token: null,
    prev_continuation_token: null,
  },
];

const getFilteredFamilies = (keyword_filters: any, concept_filters: any) => {
  const filteredFamilies = [];
  if (keyword_filters.countries) {
    keyword_filters.countries.forEach((country: string) => {
      const filteredFamily = families.filter((family) => {
        return family.family_geographies.includes(country);
      });
      filteredFamilies.push(...filteredFamily);
    });
    return filteredFamilies;
  }
  if (concept_filters) {
    concept_filters.forEach((conceptFilter) => {
      const filteredFamily = families.filter((family) => {
        return (
          family.family_documents &&
          family.family_documents.some(
            (doc) =>
              doc.document_passage_matches &&
              doc.document_passage_matches.concepts &&
              doc.document_passage_matches.concepts.some((concept) => concept.name === conceptFilter.value)
          )
        );
      });
      filteredFamilies.push(...filteredFamily);
    });
    return filteredFamilies;
  }
  return families;
};

export { getFilteredFamilies };
