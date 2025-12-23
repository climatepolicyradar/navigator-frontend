import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import cccConfig from "@/ccc/config";
import { createFeatureFlags } from "@/mocks/featureFlags";
import { resetPage } from "@/mocks/helpers";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import { setUpFamiliesRepo } from "@/mocks/repository";
import Search from "@/pages/search";
import { TConcept, TFamily } from "@/types";

afterEach(() => {
  resetPage();
});

const basicLegalConcepts: TConcept[] = [
  {
    wikibase_id: "category/Parent Test Case Category",
    preferred_label: "Parent Test Case Category",
    subconcept_of: [],
    recursive_subconcept_of: [],
    type: "category",
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "category/Test Case Category 1",
    preferred_label: "Test Case Category 1",
    subconcept_of: ["category/Parent Test Case Category"],
    recursive_subconcept_of: ["category/Parent Test Case Category"],
    type: "category",
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "category/Test Case Category 2",
    preferred_label: "Test Case Category 2",
    subconcept_of: ["category/Parent Test Case Category"],
    recursive_subconcept_of: ["category/Parent Test Case Category"],
    type: "category",
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "principal_law/Test Principal Law 1",
    preferred_label: "Test Principal Law 1",
    subconcept_of: [],
    recursive_subconcept_of: [],
    type: "principal_law",
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "principal_law/Test Principal Law 2",
    preferred_label: "Test Principal Law 2",
    subconcept_of: [],
    recursive_subconcept_of: [],
    type: "principal_law",
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "jurisdiction/Test Jurisdiction 1",
    preferred_label: "Test Jurisdiction 1",
    subconcept_of: [],
    recursive_subconcept_of: [],
    type: "jurisdiction",
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
  {
    wikibase_id: "jurisdiction/Test Jurisdiction 2",
    preferred_label: "Test Jurisdiction 2",
    subconcept_of: [],
    recursive_subconcept_of: [],
    type: "jurisdiction",
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  },
];

const baseSearchProps: any = {
  envConfig: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
  },
  theme: "ccc",
  themeConfig: cccConfig,
  featureFlags: createFeatureFlags({
    "concepts-v1": false,
    litigation: true,
  }),
  conceptsData: null,
  familyConceptsData: basicLegalConcepts,
};

describe("SearchPage", async () => {
  it("filters search results by subdivision", async () => {
    // @ts-ignore
    renderWithAppContext(Search, baseSearchProps);

    await screen.findByRole("heading", { level: 2, name: "Search results" });

    // Verify slideout is initially closed.
    expect(screen.queryByText("Subdivision")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Geography" }));

    // Verify the slideout is now open.
    expect(screen.getByText("Subdivision")).toBeInTheDocument();

    // Find the subdivision option and click it.
    const subdivisionOption = screen.getByRole("checkbox", { name: "New South Wales" });

    await userEvent.click(subdivisionOption);

    expect(subdivisionOption).toBeChecked();

    // Verify the applied filter for the selected subdivision is visible.
    expect(screen.getByRole("button", { name: "Geography: New South Wales" })).toBeInTheDocument();

    // Verify the results are filtered by the subdivision.
    expect(screen.getByText("Results:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New South Wales Litigation Case" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Australia Litigation Case" })).not.toBeInTheDocument();
  });

  it("removes country and subdivision filters when a region filter is removed ", async () => {
    // @ts-ignore
    renderWithAppContext(Search, baseSearchProps);

    await screen.findByRole("heading", { level: 2, name: "Search results" });

    await userEvent.click(screen.getByRole("button", { name: "Geography" }));

    // Verify the slideout is now open.
    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByText("Published jurisdiction")).toBeInTheDocument();
    expect(screen.getByText("Subdivision")).toBeInTheDocument();

    // Find the region, country, and subdivision options and click them.
    const regionFilterOption = screen.getByRole("checkbox", { name: "East Asia & Pacific" });
    const countryFilterOption = screen.getByRole("checkbox", { name: "Australia" });
    const subdivisionFilterOption = screen.getByRole("checkbox", { name: "New South Wales" });

    await userEvent.click(regionFilterOption);
    await userEvent.click(countryFilterOption);
    await userEvent.click(subdivisionFilterOption);

    const appliedRegionFilter = screen.getByRole("button", { name: "East Asia & Pacific" });
    const appliedCountryFilter = screen.getByRole("button", { name: "Geography: Australia" });
    const appliedSubdivisionFilter = screen.getByRole("button", { name: "Geography: New South Wales" });

    // Uncheck the filter for the region.
    await userEvent.click(regionFilterOption);

    expect(regionFilterOption).not.toBeChecked();
    expect(countryFilterOption).not.toBeChecked();
    expect(subdivisionFilterOption).not.toBeChecked();

    expect(appliedRegionFilter).not.toBeInTheDocument();
    expect(appliedCountryFilter).not.toBeInTheDocument();
    expect(appliedSubdivisionFilter).not.toBeInTheDocument();
  });

  it("removes subdivision filters when a country filter is removed", async () => {
    // @ts-ignore
    renderWithAppContext(Search, baseSearchProps);

    await screen.findByRole("heading", { level: 2, name: "Search results" });

    await userEvent.click(await screen.findByRole("button", { name: "Geography" }));

    // Verify the slideout is now open.
    expect(screen.getByText("Published jurisdiction")).toBeInTheDocument();
    expect(screen.getByText("Subdivision")).toBeInTheDocument();

    // Find the country and subdivision options and click them.
    const countryFilterOption = screen.getByRole("checkbox", { name: "Australia" });
    const subdivisionFilterOption = screen.getByRole("checkbox", { name: "New South Wales" });

    await userEvent.click(countryFilterOption);
    await userEvent.click(subdivisionFilterOption);

    const countryFilter = screen.getByRole("button", { name: "Geography: Australia" });
    const subdivisionFilter = screen.getByRole("button", { name: "Geography: New South Wales" });
    expect(countryFilter).toBeInTheDocument();
    expect(subdivisionFilter).toBeInTheDocument();

    // Remove the applied filter for country.
    await userEvent.click(countryFilterOption);

    expect(countryFilterOption).not.toBeChecked();
    expect(subdivisionFilterOption).not.toBeChecked();
    expect(countryFilter).not.toBeInTheDocument();
    expect(subdivisionFilter).not.toBeInTheDocument();
  });

  it("filters search results by case category", async () => {
    // @ts-ignore
    renderWithAppContext(Search, {
      ...baseSearchProps,
      familyConceptsData: basicLegalConcepts,
    });

    await screen.findByRole("heading", { level: 2, name: "Search results" });

    await userEvent.click(screen.getByRole("button", { name: "Case categories" }));

    expect(screen.getAllByText("Parent Test Case Category")).toHaveLength(1);

    const caseCategoryOption1 = screen.getByRole("checkbox", { name: "Test Case Category 1" });
    const caseCategoryOption2 = screen.getByRole("checkbox", { name: "Test Case Category 2" });
    expect(caseCategoryOption1).toBeInTheDocument();
    expect(caseCategoryOption2).toBeInTheDocument();

    await userEvent.click(caseCategoryOption1);

    expect(caseCategoryOption1).toBeChecked();
    // check for applied filter button
    expect(screen.getByRole("button", { name: "Test Case Category 1" })).toBeInTheDocument();

    expect(screen.getByText("Results:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Family With Test Case Category 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family With Test Case Category 2" })).not.toBeInTheDocument();
  });

  it("removing a case category filter updates search results", async () => {
    // @ts-ignore
    renderWithAppContext(Search, {
      ...baseSearchProps,
      familyConceptsData: basicLegalConcepts,
    });

    const familyWithCategory1: TFamily = {
      family_slug: "family-with-test-case-category-1-ca23",
      family_name: "Family With Test Case Category 1",
      family_description: "<p>Family With Test Case Category 1</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      metadata: [
        { name: "id", value: "" },
        { name: "status", value: "" },
        { name: "family.case_number", value: "2022/00114664; [2022] NSWSC 576" },
        { name: "family.core_object", value: "Family With Test Case Category 1" },
        { name: "family.concept_preferred_label", value: "category/Test Case Category 1" },
        { name: "family.concept_preferred_label", value: "category/Parent Test Case Category" },
      ],
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    const familyWithCategory2: TFamily = {
      family_slug: "family-with-test-case-category-2-ca23",
      family_name: "Family With Test Case Category 2",
      family_description: "<p>Family With Test Case Category 2</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      metadata: [
        { name: "id", value: "" },
        { name: "status", value: "" },
        { name: "family.case_number", value: "2022/00114664; [2022] NSWSC 576" },
        { name: "family.core_object", value: "Family With Test Case Category 2" },
        { name: "family.concept_preferred_label", value: "category/Test Case Category 2" },
        { name: "family.concept_preferred_label", value: "category/Parent Test Case Category" },
      ],
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    setUpFamiliesRepo([familyWithCategory1, familyWithCategory2]);

    await screen.findByRole("heading", { level: 2, name: "Search results" });

    await userEvent.click(screen.getByRole("button", { name: "Case categories" }));

    await userEvent.click(screen.getByRole("checkbox", { name: "Test Case Category 1" }));

    // verify applied filter is displayed
    const appliedFilter = screen.getByRole("button", { name: "Test Case Category 1" });
    expect(appliedFilter).toBeInTheDocument();
    // verify the parent concept is displayed by default
    const parentConceptAppliedFilter = screen.getByRole("button", { name: "Parent Test Case Category" });
    expect(parentConceptAppliedFilter).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Family With Test Case Category 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family With Test Case Category 2" })).not.toBeInTheDocument();

    // remove applied filter
    await userEvent.click(appliedFilter);
    await userEvent.click(parentConceptAppliedFilter);

    expect(screen.getByRole("link", { name: "Family With Test Case Category 1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Family With Test Case Category 2" })).toBeInTheDocument();
  });

  it("removing a principal law filter updates search results", async () => {
    // @ts-ignore
    renderWithAppContext(Search, {
      ...baseSearchProps,
      familyConceptsData: basicLegalConcepts,
    });

    const familyWithPrincipalLaw1: TFamily = {
      family_slug: "family-with-test-principal-law-1-ca23",
      family_name: "Family With Test Principal Law 1",
      family_description: "<p>Family With Test Principal Law 1</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      metadata: [
        { name: "id", value: "" },
        { name: "status", value: "" },
        { name: "family.case_number", value: "2022/00114664; [2022] NSWSC 576" },
        { name: "family.core_object", value: "Family With Test Principal Law 1" },
        { name: "family.concept_preferred_label", value: "principal_law/Test Principal Law 1" },
      ],
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    const familyWithCategory2: TFamily = {
      family_slug: "family-with-test-principal-law-2-ca23",
      family_name: "Family With Test Principal Law 2",
      family_description: "<p>Family With Test Principal Law 2</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      metadata: [
        { name: "family.id", value: "" },
        { name: "family.status", value: "" },
        { name: "family.case_number", value: "2022/00114664; [2022] NSWSC 576" },
        { name: "family.core_object", value: "Family With Test Principal Law 2" },
        { name: "family.concept_preferred_label", value: "principal_law/Test Principal Law 2" },
      ],
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    setUpFamiliesRepo([familyWithPrincipalLaw1, familyWithCategory2]);

    await screen.findByRole("heading", { level: 2, name: "Search results" });

    await userEvent.click(screen.getByRole("button", { name: "Principal laws" }));

    await userEvent.click(screen.getByRole("radio", { name: "Test Principal Law 1" }));

    const appliedFilter = screen.getByRole("button", { name: "Principal laws: Test Principal Law 1" });
    expect(appliedFilter).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Family With Test Principal Law 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family With Test Principal Law 2" })).not.toBeInTheDocument();

    // remove applied filter
    await userEvent.click(appliedFilter);

    expect(screen.getByRole("link", { name: "Family With Test Principal Law 1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Family With Test Principal Law 2" })).toBeInTheDocument();
  });

  it("removing a jurisdiction filter updates search results", async () => {
    // @ts-ignore
    renderWithAppContext(Search, {
      ...baseSearchProps,
      familyConceptsData: basicLegalConcepts,
    });

    const familyWithJurisdiction1: TFamily = {
      family_slug: "family-with-test-jurisdiction-1-ca23",
      family_name: "Family With Test Jurisdiction 1",
      family_description: "<p>Family With Test Jurisdiction 1</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      metadata: [
        { name: "family.id", value: "" },
        { name: "family.status", value: "" },
        { name: "family.case_number", value: "2022/00114664; [2022] NSWSC 576" },
        { name: "family.core_object", value: "Family With Test Jurisdiction 1" },
        { name: "family.concept_preferred_label", value: "jurisdiction/Test Jurisdiction 1" },
      ],
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    const familyWithJurisdiction2: TFamily = {
      family_slug: "family-with-test-principal-law-2-ca23",
      family_name: "Family With Test Jurisdiction 2",
      family_description: "<p>Family With Test Jurisdiction 2</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      metadata: [
        { name: "family.id", value: "" },
        { name: "family.status", value: "" },
        { name: "family.case_number", value: "2022/00114664; [2022] NSWSC 576" },
        { name: "family.core_object", value: "Family With Test Jurisdiction 2" },
        { name: "family.concept_preferred_label", value: "jurisdiction/Test Jurisdiction 2" },
      ],
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    setUpFamiliesRepo([familyWithJurisdiction1, familyWithJurisdiction2]);

    await screen.findByRole("heading", { level: 2, name: "Search results" });

    await userEvent.click(screen.getByRole("button", { name: "Jurisdictions" }));

    await userEvent.click(screen.getByRole("radio", { name: "Test Jurisdiction 1" }));

    const appliedFilter = screen.getByRole("button", { name: "Jurisdiction: Test Jurisdiction 1" });
    expect(appliedFilter).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Family With Test Jurisdiction 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family With Test Jurisdiction 2" })).not.toBeInTheDocument();

    // remove applied filter
    await userEvent.click(appliedFilter);

    expect(screen.getByRole("link", { name: "Family With Test Jurisdiction 1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Family With Test Jurisdiction 2" })).toBeInTheDocument();
  });
});
