import { screen } from "@testing-library/react";

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
    searchQuery: {
      keyword_filters: {
        regions: [],
        countries: [],
        subdivisions: [],
      },
    },
    countries: [
      { id: 1, display_value: "Country 1", value: "COU-1", type: "country", parent_id: 1, slug: "country-1" },
      { id: 2, display_value: "Country 2", value: "COU-2", type: "country", parent_id: 2, slug: "country-2" },
      { id: 3, display_value: "Country 3", value: "COU-3", type: "country", parent_id: 2, slug: "country-3" },
    ],
    regionFilterLabel: "Region",
    countryFilterLabel: "Published jurisdiction",
  };

  it("only shows a list of all countries when no region is selected", async () => {
    renderWithAppContext(GeographyPicker, geoPickerProps);

    expect(await screen.findByText("Published jurisdiction")).toBeInTheDocument();

    const allCheckboxes = screen.getAllByRole("checkbox");
    const countryOptions = allCheckboxes.filter((cb) => (cb as HTMLInputElement).name.startsWith("country-"));

    expect(countryOptions).toHaveLength(3);
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
    const allCheckboxes = screen.getAllByRole("checkbox");
    const countryOptions = allCheckboxes.filter((cb) => (cb as HTMLInputElement).name.startsWith("country-"));

    expect(countryOptions).toHaveLength(2);
    expect(screen.queryByRole("checkbox", { name: "Country 1" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Country 2" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Country 3" })).toBeInTheDocument();
  });

  it("only shows a list of all subdivisions when no country is selected", async () => {
    renderWithAppContext(GeographyPicker, geoPickerProps);

    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    const allCheckboxes = screen.getAllByRole("checkbox");
    const subdivisionOptions = allCheckboxes.filter((cb) => (cb as HTMLInputElement).name.startsWith("subdivision-"));

    expect(subdivisionOptions).toHaveLength(3);

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

    const allCheckboxes = screen.getAllByRole("checkbox");
    const subdivisionOptions = allCheckboxes.filter((cb) => (cb as HTMLInputElement).name.startsWith("subdivision-"));

    expect(subdivisionOptions).toHaveLength(1);

    expect(screen.getByRole("checkbox", { name: "Subdivision 1" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Subdivision 2" })).not.toBeInTheDocument();
  });

  it("only shows a list of subdivisions related to the selected region", async () => {
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

    const allCheckboxes = screen.getAllByRole("checkbox");
    const subdivisionOptions = allCheckboxes.filter((cb) => (cb as HTMLInputElement).name.startsWith("subdivision-"));

    expect(subdivisionOptions).toHaveLength(2);

    expect(screen.queryByRole("checkbox", { name: "Subdivision 1" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Subdivision 2" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Subdivision 3" })).toBeInTheDocument();
  });
});
