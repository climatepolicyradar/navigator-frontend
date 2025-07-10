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
      concept_preferred_label: ["Australia", "Suits against governments"],
    },
    family_title_match: false,
    family_description_match: false,
    total_passage_hits: 1,
    family_documents: [],
    continuation_token: null,
    prev_continuation_token: null,
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
      concept_preferred_label: ["Australia", "New South Wales", "Corporations", "Suits against corporations, individuals"],
    },
    family_title_match: false,
    family_description_match: false,
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
