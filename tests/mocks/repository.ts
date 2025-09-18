const families = [
  {
    family_slug: "belize-ndc-8ee3",
    family_name: "Belize NDC",
    family_description: "<p>Belize NDC</p>",
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
    family_slug: "argentina-report-btr1_19b7",
    family_name: "Argentina Report",
    family_description: "<p>Argentina Report</p>",
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
    family_slug: "afghanistan-report-16v6",
    family_name: "Afghanistan Report",
    family_description: "<p>Afghanistan Report</p>",
    family_category: "UNFCCC",
    family_date: "2024-12-19T00:00:00+00:00",
    family_last_updated_date: "2024-12-19T00:00:00+00:00",
    family_source: "UNFCCC",
    corpus_import_id: "UNFCCC.corpus.i00000001.n0000",
    corpus_type_name: "Intl. agreements",
    family_geographies: ["AFG"],
    family_metadata: {
      author: ["Afghanistan"],
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
    family_slug: "australia-litigation-case-ca16",
    family_name: "Australia Litigation Case",
    family_description: "<p>Australia Litigation Case</p>",
    family_category: "Litigation",
    family_date: "2019-12-31T00:00:00+00:00",
    family_last_updated_date: "2019-12-31T00:00:00+00:00",
    family_source: "Sabin",
    corpus_import_id: "Academic.corpus.Litigation.n0000",
    corpus_type_name: "Litigation",
    family_geographies: ["AUS"],
    family_metadata: {
      id: ["16950"],
      status: ["Decided"],
      case_number: ["2022/00114664; [2022] NSWSC 575"],
      core_object: ["Australia Litigation Case"],
      concept_preferred_label: ["jurisdiction/Australia", "category/Suits against governments"],
    },
    family_title_match: false,
    family_description_match: false,
    total_passage_hits: 1,
    family_documents: [],
  },
  {
    family_slug: "new-south-wales-case-ca17",
    family_name: "New South Wales Litigation Case",
    family_description: "<p>New South Wales Case</p>",
    family_category: "Litigation",
    family_date: "2019-12-31T00:00:00+00:00",
    family_last_updated_date: "2019-12-31T00:00:00+00:00",
    family_source: "Sabin",
    corpus_import_id: "Academic.corpus.Litigation.n0000",
    corpus_type_name: "Litigation",
    family_geographies: ["AUS", "AU-NSW"],
    family_metadata: {
      id: ["16951"],
      status: ["Decided"],
      case_number: ["2022/00114664; [2022] NSWSC 576"],
      core_object: ["New South Wales Case."],
      concept_preferred_label: [
        "jurisdiction/Australia",
        "jurisdiction/New South Wales",
        "category/Corporations",
        "category/Suits against corporations, individuals",
      ],
    },
    family_title_match: false,
    family_description_match: false,
    total_passage_hits: 1,
    family_documents: [],
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
  {
    family_slug: "family-with-test-case-category-1-ca17",
    family_name: "Family With Test Case Category 1",
    family_description: "<p>Family With Test Case Category 1</p>",
    family_category: "Litigation",
    family_date: "2019-12-31T00:00:00+00:00",
    family_last_updated_date: "2019-12-31T00:00:00+00:00",
    family_source: "Sabin",
    corpus_import_id: "Academic.corpus.Litigation.n0000",
    corpus_type_name: "Litigation",
    family_geographies: ["XAA"],
    family_metadata: {
      id: [""],
      status: [""],
      case_number: ["2022/00114664; [2022] NSWSC 576"],
      core_object: ["Family With Test Case Category 1"],
      concept_preferred_label: ["category/Test Case Category 1", "category/Parent Test Case Category"],
    },
    family_title_match: false,
    family_description_match: false,
    total_passage_hits: 1,
    family_documents: [],
  },
  {
    family_slug: "family-with-test-case-category-2-ca17",
    family_name: "Family With Test Case Category 2",
    family_description: "<p>Family With Test Case Category 2</p>",
    family_category: "Litigation",
    family_date: "2019-12-31T00:00:00+00:00",
    family_last_updated_date: "2019-12-31T00:00:00+00:00",
    family_source: "Sabin",
    corpus_import_id: "Academic.corpus.Litigation.n0000",
    corpus_type_name: "Litigation",
    family_geographies: ["XAA"],
    family_metadata: {
      id: [""],
      status: [""],
      case_number: ["2022/00114664; [2022] NSWSC 576"],
      core_object: ["Family With Test Case Category 2"],
      concept_preferred_label: ["category/Test Case Category 2", "category/Parent Test Case Category"],
    },
    family_title_match: false,
    family_description_match: false,
    total_passage_hits: 1,
    family_documents: [],
  },
];

let familiesRepo = families;

const iso_slug_mapping = { belize: "BLZ", argentina: "ARG", australia: "AUS", afghanistan: "AFG", "united-states": "USA" };

const setUpFamiliesRepo = (test_families: any[]) => {
  familiesRepo = test_families;
};

const getFilteredFamilies = (keyword_filters: any, concept_filters: any, metadata: any) => {
  let filteredFamilies = [...familiesRepo]; // start with all and whittle down
  if (keyword_filters.countries) {
    keyword_filters.countries.forEach((country: string) => {
      filteredFamilies = filteredFamilies.filter((family) => {
        return family.family_geographies.includes(iso_slug_mapping[country]);
      });
    });
    return filteredFamilies;
  }
  if (keyword_filters.subdivisions && keyword_filters.subdivisions.length > 0) {
    keyword_filters.subdivisions.forEach((subdivision: string) => {
      filteredFamilies = filteredFamilies.filter((family) => {
        return family.family_geographies.includes(subdivision);
      });
    });
    return filteredFamilies;
  }
  if (concept_filters.length > 0) {
    concept_filters.forEach((conceptFilter) => {
      filteredFamilies = filteredFamilies.filter((family) => {
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
    });
    return filteredFamilies;
  }
  if (metadata.length > 0) {
    metadata.forEach((metadataFilter) => {
      filteredFamilies = filteredFamilies.filter((family) => {
        return (
          family.family_metadata &&
          family.family_metadata.concept_preferred_label &&
          family.family_metadata.concept_preferred_label.some((concept_preferred_label) => concept_preferred_label === metadataFilter.value)
        );
      });
    });
    return filteredFamilies;
  }

  return filteredFamilies;
};

export { getFilteredFamilies, setUpFamiliesRepo };
