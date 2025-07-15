import { screen } from "@testing-library/react";

import { renderWithAppContext } from "@/mocks/renderWithAppContext";

import { GeographyPicker } from "./GeographyPicker";

vi.mock("@/hooks/useSubdivisions", () => ({
  default: () => ({
    data: [
      { code: "SUB-1", name: "Subdivision 1" },
      { code: "SUB-2", name: "Subdivision 2" },
      { code: "SUB-3", name: "Subdivision 3" },
    ],
  }),
}));

describe("GeographyPicker", () => {
  it("only shows a list of all subdivisions when no country is selected", async () => {
    const geoPickerProps = {
      envConfig: {
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
      },
      regions: [],
      handleRegionChange: () => {},
      handleFilterChange: () => {},
      searchQuery: {
        keyword_filters: {
          regions: [],
          countries: [],
          subdivisions: [],
        },
      },
      countries: [],
      regionFilterLabel: "Region",
      countryFilterLabel: "Published jurisdiction",
    };

    renderWithAppContext(GeographyPicker, geoPickerProps);

    expect(await screen.findByText("Region")).toBeInTheDocument();
    expect(await screen.findByText("Published jurisdiction"));
    expect(await screen.findByText("Subdivision")).toBeInTheDocument();

    const allCheckboxes = screen.getAllByRole("checkbox");
    const subdivisionOptions = allCheckboxes.filter((cb) => (cb as HTMLInputElement).name.startsWith("subdivision-"));

    expect(subdivisionOptions).toHaveLength(3);

    expect(screen.getByRole("checkbox", { name: "Subdivision 1" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Subdivision 2" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Subdivision 3" })).toBeInTheDocument();
  });
});
