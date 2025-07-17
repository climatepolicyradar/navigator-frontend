import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithAppContext } from "@/mocks/renderWithAppContext";

import { GeographyPicker } from "./GeographyPicker";

const subdivisions = [
  { code: "SUB-1", name: "Subdivision 1", country_alpha_3: "COU-1" },
  { code: "SUB-2", name: "Subdivision 2", country_alpha_3: "COU-2" },
  { code: "SUB-3", name: "Subdivision 3", country_alpha_3: "COU-3" },
];

vi.mock("@/hooks/useSubdivisions", () => ({
  default: () => ({
    data: subdivisions,
  }),
}));

vi.mock("@/hooks/useGeographySubdivisions", () => ({
  default: (ids: string[]) => ({
    data: subdivisions.filter((s) => ids?.includes(s.country_alpha_3)),
  }),
}));

vi.mock("@/utils/featureFlags", () => ({
  getFeatureFlags: () => ({
    litigation: true,
  }),
}));

describe("GeographyPicker", () => {
  const geoPickerProps = {
    envConfig: {
      BACKEND_API_URL: process.env.BACKEND_API_URL,
      CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
    },
    regions: [
      { id: 1, display_value: "Region 1", value: "REG-1", type: "region", parent_id: null, slug: "region-1" },
      { id: 2, display_value: "Region 2", value: "REG-2", type: "region", parent_id: null, slug: "region-2" },
    ],
    handleRegionChange: () => {},
    handleFilterChange: () => {},
    searchQuery: {},
    countries: [
      { id: 1, display_value: "Country 1", value: "COU-1", type: "country", parent_id: 1, slug: "country-1" },
      { id: 2, display_value: "Country 2", value: "COU-2", type: "country", parent_id: 2, slug: "country-2" },
      { id: 3, display_value: "Country 3", value: "COU-3", type: "country", parent_id: 2, slug: "country-3" },
    ],
    regionFilterLabel: "Region",
    countryFilterLabel: "Published jurisdiction",
    litigationEnabled: true,
  };

  it("shows a list of all countries when no region is selected", async () => {
    renderWithAppContext(GeographyPicker, {
      ...geoPickerProps,
      searchQuery: {
        keyword_filters: {
          regions: [],
          countries: [],
          subdivisions: [],
        },
      },
    });

    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();

    expect(screen.getByRole("checkbox", { name: "Country 1" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Country 2" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Country 3" })).toBeInTheDocument();
  });

  it("only shows a list of countries related to the selected region", async () => {
    renderWithAppContext(GeographyPicker, {
      ...geoPickerProps,
      searchQuery: {
        keyword_filters: {
          regions: ["region-2"],
          countries: [],
          subdivisions: [],
        },
      },
    });

    expect(await screen.findByText("Region")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Region 2" })).toBeChecked();

    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();

    expect(screen.queryByRole("checkbox", { name: "Country 1" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Country 2" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Country 3" })).toBeInTheDocument();
  });

  it("shows a list of all subdivisions when no country is selected", async () => {
    renderWithAppContext(GeographyPicker, {
      ...geoPickerProps,
      searchQuery: {
        keyword_filters: {
          regions: [],
          countries: [],
          subdivisions: [],
        },
      },
    });

    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    expect(screen.getByRole("checkbox", { name: "Subdivision 1" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Subdivision 2" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Subdivision 3" })).toBeInTheDocument();
  });

  it("only shows a list of subdivisions related to the selected country", async () => {
    renderWithAppContext(GeographyPicker, {
      ...geoPickerProps,
      searchQuery: {
        keyword_filters: {
          regions: [],
          countries: ["country-1"],
          subdivisions: [],
        },
      },
    });

    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Country 1" })).toBeChecked();

    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    expect(screen.getByRole("checkbox", { name: "Subdivision 1" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Subdivision 2" })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Subdivision 3" })).not.toBeInTheDocument();
  });

  it("only shows a list of subdivisions related to the selected region when no country is selected", async () => {
    renderWithAppContext(GeographyPicker, {
      ...geoPickerProps,
      searchQuery: {
        keyword_filters: {
          regions: ["region-2"],
          countries: [],
          subdivisions: [],
        },
      },
    });

    expect(await screen.findByText("Region")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Region 2" })).toBeChecked();

    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    expect(screen.queryByRole("checkbox", { name: "Subdivision 1" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Subdivision 2" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Subdivision 3" })).toBeInTheDocument();
  });

  it("only shows a list of subdivisions related to the selected country if both country and region are selected", async () => {
    renderWithAppContext(GeographyPicker, {
      ...geoPickerProps,
      searchQuery: {
        keyword_filters: {
          regions: ["region-2"],
          countries: ["country-3"],
          subdivisions: [],
        },
      },
    });

    expect(await screen.findByText("Region")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Region 2" })).toBeChecked();

    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    expect(screen.queryByRole("checkbox", { name: "Subdivision 1" })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Subdivision 2" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Subdivision 3" })).toBeInTheDocument();
  });

  it("using country quick search narrows down the list of country options to match what is typed", async () => {
    renderWithAppContext(GeographyPicker, {
      ...geoPickerProps,
      searchQuery: {
        keyword_filters: {
          regions: [],
          countries: [],
          subdivisions: [],
        },
      },
    });

    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(screen.getByRole("textbox", { name: "Country quick search" }), "Country 1");
    });

    expect(screen.getByRole("checkbox", { name: "Country 1" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Country 2" })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Country 3" })).not.toBeInTheDocument();
  });

  it("using subdivision quick search narrows down the list of subdivision options to match what is typed", async () => {
    renderWithAppContext(GeographyPicker, {
      ...geoPickerProps,
      searchQuery: {
        keyword_filters: {
          regions: [],
          countries: [],
          subdivisions: [],
        },
      },
    });

    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(screen.getByRole("textbox", { name: "Subdivision quick search" }), "Subdivision 1");
    });

    expect(screen.getByRole("checkbox", { name: "Subdivision 1" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Subdivision 2" })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Subdivision 3" })).not.toBeInTheDocument();
  });
});
