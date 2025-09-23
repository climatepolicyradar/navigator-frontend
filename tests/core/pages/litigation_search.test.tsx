import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import router from "next-router-mock";

import cccConfig from "@/ccc/config";
import { createFeatureFlags } from "@/mocks/featureFlags";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import { setUpFamiliesRepo } from "@/mocks/repository";
import Search from "@/pages/search";

// Mock the useHashNavigation hook to provide controlled slideout state
let mockCurrentSlideOut = "";
let mockSetCurrentSlideOut = vi.fn();

vi.mock("@/hooks/useHashNavigation", () => ({
  useHashNavigation: () => ({
    currentSlideOut: mockCurrentSlideOut,
    setCurrentSlideOut: mockSetCurrentSlideOut,
    updateHash: vi.fn(),
  }),
}));

afterEach(() => {
  // clear router state between tests
  // we store query params in the router state so this resets everything
  router.reset();
});

const basicLegalConcepts = [
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

const baseSearchProps = {
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
    mockCurrentSlideOut = ""; // Make sure we start with slideout closed.

    // @ts-ignore
    const { rerender } = renderWithAppContext(Search, baseSearchProps, {
      currentSlideOut: mockCurrentSlideOut,
      setCurrentSlideOut: mockSetCurrentSlideOut,
    });

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // Verify slideout is initially closed.
    expect(screen.queryByText("Subdivision")).not.toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Geography" }));
    });
    expect(mockSetCurrentSlideOut).toHaveBeenCalledWith("geographies");

    // Now simulate the slideout being open by updating the context & rerendering.
    mockCurrentSlideOut = "geographies";

    // @ts-ignore
    rerender(Search, baseSearchProps, { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut });

    // Verify the slideout is now open.
    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    // Find the subdivision option and click it.
    const subdivisionOption = await screen.findByRole("checkbox", { name: "New South Wales" });
    await act(async () => {
      await userEvent.click(subdivisionOption);
    });
    expect(subdivisionOption).toBeChecked();

    // Verify the applied filter for the selected subdivision is visible.
    expect(screen.getByRole("button", { name: "New South Wales" })).toBeInTheDocument();

    // Verify the results are filtered by the subdivision.
    expect(await screen.findByText("Results:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New South Wales Litigation Case" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Australia Litigation Case" })).not.toBeInTheDocument();
  });

  it("removes country and subdivision filters when a region filter is removed ", async () => {
    mockCurrentSlideOut = ""; // Make sure we start with slideout closed.

    // @ts-ignore
    const { rerender } = renderWithAppContext(Search, baseSearchProps, {
      currentSlideOut: mockCurrentSlideOut,
      setCurrentSlideOut: mockSetCurrentSlideOut,
    });

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      const geographyButton = await screen.findByRole("button", { name: "Geography" });
      expect(geographyButton).toBeVisible();
      await userEvent.click(geographyButton);
    });
    expect(mockSetCurrentSlideOut).toHaveBeenCalledWith("geographies");

    // Now simulate the slideout being open by updating the context & rerendering.
    mockCurrentSlideOut = "geographies";

    // @ts-ignore
    rerender(Search, baseSearchProps, { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut });

    // Verify the slideout is now open.
    expect(await screen.findByText("Region")).toBeInTheDocument();
    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();
    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    // Find the region, country, and subdivision options and click them.
    const regionFilterOption = screen.getByRole("checkbox", { name: "East Asia & Pacific" });
    const countryFilterOption = screen.getByRole("checkbox", { name: "Australia" });
    const subdivisionFilterOption = screen.getByRole("checkbox", { name: "New South Wales" });

    await act(async () => {
      await userEvent.click(regionFilterOption);
      await userEvent.click(countryFilterOption);
      await userEvent.click(subdivisionFilterOption);
    });

    const appliedRegionFilter = screen.getByRole("button", { name: "East Asia & Pacific" });
    const appliedCountryFilter = screen.getByRole("button", { name: "Australia" });
    const appliedSubdivisionFilter = screen.getByRole("button", { name: "New South Wales" });

    // Uncheck the filter for the region.
    await act(async () => {
      await userEvent.click(regionFilterOption);
    });

    expect(regionFilterOption).not.toBeChecked();
    expect(countryFilterOption).not.toBeChecked();
    expect(subdivisionFilterOption).not.toBeChecked();

    expect(appliedRegionFilter).not.toBeInTheDocument();
    expect(appliedCountryFilter).not.toBeInTheDocument();
    expect(appliedSubdivisionFilter).not.toBeInTheDocument();
  });

  it("removes subdivision filters when a country filter is removed", async () => {
    mockCurrentSlideOut = ""; // Make sure we start with slideout closed.

    // @ts-ignore
    const { rerender } = renderWithAppContext(Search, baseSearchProps, {
      currentSlideOut: mockCurrentSlideOut,
      setCurrentSlideOut: mockSetCurrentSlideOut,
    });

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Geography" }));
    });
    expect(mockSetCurrentSlideOut).toHaveBeenCalledWith("geographies");

    // Now simulate the slideout being open by updating the context & rerendering.
    mockCurrentSlideOut = "geographies";

    // @ts-ignore
    rerender(Search, baseSearchProps, { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut });

    // Verify the slideout is now open.
    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();
    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    // Find the country and subdivision options and click them.
    const countryFilterOption = await screen.findByRole("checkbox", { name: "Australia" });
    const subdivisionFilterOption = await screen.findByRole("checkbox", { name: "New South Wales" });
    await act(async () => {
      await userEvent.click(countryFilterOption);
      await userEvent.click(subdivisionFilterOption);
    });

    const countryFilter = screen.getByRole("button", { name: "Australia" });
    const subdivisionFilter = screen.getByRole("button", { name: "New South Wales" });
    expect(countryFilter).toBeInTheDocument();
    expect(subdivisionFilter).toBeInTheDocument();

    // Remove the applied filter for country.
    await act(async () => {
      await userEvent.click(countryFilterOption);
    });

    expect(countryFilterOption).not.toBeChecked();
    expect(subdivisionFilterOption).not.toBeChecked();
    expect(countryFilter).not.toBeInTheDocument();
    expect(subdivisionFilter).not.toBeInTheDocument();
  });

  it("filters search results by case category", async () => {
    mockCurrentSlideOut = ""; // Make sure we start with slideout closed.

    const { rerender } = renderWithAppContext(
      // @ts-ignore
      Search,
      {
        ...baseSearchProps,
        familyConceptsData: basicLegalConcepts,
      },
      { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut }
    );

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Case categories" }));
    });
    expect(mockSetCurrentSlideOut).toHaveBeenCalledWith("categories");

    // Now simulate the slideout being open by updating the context & rerendering.
    mockCurrentSlideOut = "categories";

    // @ts-ignore
    rerender(Search, baseSearchProps, { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut });

    expect(await screen.findAllByText("Parent Test Case Category")).toHaveLength(1);

    const caseCategoryOption1 = screen.getByRole("checkbox", { name: "Test Case Category 1" });
    const caseCategoryOption2 = screen.getByRole("checkbox", { name: "Test Case Category 2" });
    expect(caseCategoryOption1).toBeInTheDocument();
    expect(caseCategoryOption2).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(caseCategoryOption1);
    });

    expect(caseCategoryOption1).toBeChecked();
    // check for applied filter button
    expect(screen.getByRole("button", { name: "Test Case Category 1" })).toBeInTheDocument();

    expect(await screen.findByText("Results:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Family With Test Case Category 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family With Test Case Category 2" })).not.toBeInTheDocument();
  });

  it("removing a case category filter updates search results", async () => {
    mockCurrentSlideOut = ""; // Make sure we start with slideout closed.

    const { rerender } = renderWithAppContext(
      // @ts-ignore
      Search,
      {
        ...baseSearchProps,
        familyConceptsData: basicLegalConcepts,
      },
      { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut }
    );

    const familyWithCategory1 = {
      family_slug: "family-with-test-case-category-1-ca23",
      family_name: "Family With Test Case Category 1",
      family_description: "<p>Family With Test Case Category 1</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
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
    };

    const familyWithCategory2 = {
      family_slug: "family-with-test-case-category-2-ca23",
      family_name: "Family With Test Case Category 2",
      family_description: "<p>Family With Test Case Category 2</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
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
    };

    setUpFamiliesRepo([familyWithCategory1, familyWithCategory2]);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Case categories" }));
    });

    // Now simulate the slideout being open by updating the context & rerendering.
    mockCurrentSlideOut = "categories";

    // @ts-ignore
    rerender(Search, baseSearchProps, { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut });

    await act(async () => {
      await userEvent.click(screen.getByRole("checkbox", { name: "Test Case Category 1" }));
      // await userEvent.click(screen.getByRole("checkbox", { name: "Parent Test Case Category" }));
    });

    // verify applied filter is displayed
    const appliedFilter = screen.getByRole("button", { name: "Test Case Category 1" });
    expect(appliedFilter).toBeInTheDocument();
    // verify the parent concept is displayed
    const parentConceptAppliedFilter = screen.getByRole("button", { name: "Parent Test Case Category" });
    expect(parentConceptAppliedFilter).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Family With Test Case Category 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family With Test Case Category 2" })).not.toBeInTheDocument();

    // remove applied filter
    await act(async () => {
      await userEvent.click(appliedFilter);
      await userEvent.click(parentConceptAppliedFilter);
    });

    expect(screen.getByRole("link", { name: "Family With Test Case Category 1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Family With Test Case Category 2" })).toBeInTheDocument();
  });

  it("removing a principal law filter updates search results", async () => {
    mockCurrentSlideOut = ""; // Make sure we start with slideout closed.

    const { rerender } = renderWithAppContext(
      // @ts-ignore
      Search,
      {
        ...baseSearchProps,
        familyConceptsData: basicLegalConcepts,
      },
      { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut }
    );

    const familyWithPrincipalLaw1 = {
      family_slug: "family-with-test-principal-law-1-ca23",
      family_name: "Family With Test Principal Law 1",
      family_description: "<p>Family With Test Principal Law 1</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      family_metadata: {
        id: [""],
        status: [""],
        case_number: ["2022/00114664; [2022] NSWSC 576"],
        core_object: ["Family With Test Principal Law 1"],
        concept_preferred_label: ["principal_law/Test Principal Law 1"],
      },
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    const familyWithCategory2 = {
      family_slug: "family-with-test-principal-law-2-ca23",
      family_name: "Family With Test Principal Law 2",
      family_description: "<p>Family With Test Principal Law 2</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      family_metadata: {
        id: [""],
        status: [""],
        case_number: ["2022/00114664; [2022] NSWSC 576"],
        core_object: ["Family With Test Principal Law 2"],
        concept_preferred_label: ["category/Test Principal Law 2"],
      },
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    setUpFamiliesRepo([familyWithPrincipalLaw1, familyWithCategory2]);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Principal laws" }));
    });
    expect(mockSetCurrentSlideOut).toHaveBeenCalledWith("principalLaws");

    // Now simulate the slideout being open by updating the context & rerendering.
    mockCurrentSlideOut = "principalLaws";

    // @ts-ignore
    rerender(Search, baseSearchProps, { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut });

    await act(async () => {
      await userEvent.click(screen.getByRole("radio", { name: "Test Principal Law 1" }));
    });

    const appliedFilter = screen.getByRole("button", { name: "Test Principal Law 1" });
    expect(appliedFilter).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Family With Test Principal Law 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family With Test Principal Law 2" })).not.toBeInTheDocument();

    // remove applied filter
    await act(async () => {
      await userEvent.click(appliedFilter);
    });

    expect(screen.getByRole("link", { name: "Family With Test Principal Law 1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Family With Test Principal Law 2" })).toBeInTheDocument();
  });

  it("removing a jurisdiction filter updates search results", async () => {
    mockCurrentSlideOut = ""; // Make sure we start with slideout closed.

    const { rerender } = renderWithAppContext(
      // @ts-ignore
      Search,
      {
        ...baseSearchProps,
        familyConceptsData: basicLegalConcepts,
      },
      { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut }
    );

    const familyWithJurisdiction1 = {
      family_slug: "family-with-test-jurisdiction-1-ca23",
      family_name: "Family With Test Jurisdiction 1",
      family_description: "<p>Family With Test Jurisdiction 1</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      family_metadata: {
        id: [""],
        status: [""],
        case_number: ["2022/00114664; [2022] NSWSC 576"],
        core_object: ["Family With Test Jurisdiction 1"],
        concept_preferred_label: ["jurisdiction/Test Jurisdiction 1"],
      },
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    const familyWithJurisdiction2 = {
      family_slug: "family-with-test-principal-law-2-ca23",
      family_name: "Family With Test Jurisdiction 2",
      family_description: "<p>Family With Test Jurisdiction 2</p>",
      family_category: "Litigation",
      family_date: "2019-12-31T00:00:00+00:00",
      family_source: "Sabin",
      corpus_import_id: "Academic.corpus.Litigation.n0000",
      corpus_type_name: "Litigation",
      family_geographies: ["XAA"],
      family_metadata: {
        id: [""],
        status: [""],
        case_number: ["2022/00114664; [2022] NSWSC 576"],
        core_object: ["Family With Test Jurisdiction 2"],
        concept_preferred_label: ["jurisdiction/Test Jurisdiction 2"],
      },
      family_title_match: false,
      family_description_match: false,
      total_passage_hits: 1,
      family_documents: [],
    };

    setUpFamiliesRepo([familyWithJurisdiction1, familyWithJurisdiction2]);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Jurisdictions" }));
    });
    expect(mockSetCurrentSlideOut).toHaveBeenCalledWith("jurisdictions");

    // Now simulate the slideout being open by updating the context & rerendering.
    mockCurrentSlideOut = "jurisdictions";

    // @ts-ignore
    rerender(Search, baseSearchProps, { currentSlideOut: mockCurrentSlideOut, setCurrentSlideOut: mockSetCurrentSlideOut });

    await act(async () => {
      await userEvent.click(screen.getByRole("radio", { name: "Test Jurisdiction 1" }));
    });

    const appliedFilter = screen.getByRole("button", { name: "Test Jurisdiction 1" });
    expect(appliedFilter).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Family With Test Jurisdiction 1" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Family With Test Jurisdiction 2" })).not.toBeInTheDocument();

    // remove applied filter
    await act(async () => {
      await userEvent.click(appliedFilter);
    });

    expect(screen.getByRole("link", { name: "Family With Test Jurisdiction 1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Family With Test Jurisdiction 2" })).toBeInTheDocument();
  });
});
