import { screen } from "@testing-library/react";

import { renderWithAppContext } from "@/mocks/renderWithAppContext";

import SearchResult from "./SearchResult";

describe("SearchResult", () => {
  it("displays all geographies as links if family has multiple geographies", async () => {
    const searchResultProps = {
      themeConfig: { features: {} },
      family: {
        corpus_type_name: "",
        family_category: "",
        family_description: "",
        family_documents: [],
        family_geographies: ["AUS", "ARG"],
        family_metadata: {},
        family_name: "Multi-geo Test Family",
        family_slug: "",
        family_source: "",
        family_date: "",
      },
      active: false,
      onClick: () => {},
    };

    renderWithAppContext(SearchResult, searchResultProps);

    expect(await screen.findByRole("link", { name: "Australia" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Argentina" })).toBeInTheDocument();
  });

  it("displays all subdivision links if family has subdivision geographies", async () => {
    const searchResultProps = {
      themeConfig: { features: {} },
      family: {
        corpus_type_name: "",
        family_category: "",
        family_description: "",
        family_documents: [],
        family_geographies: ["AUS", "AU-NSW", "AU-QLD"],
        family_metadata: {},
        family_name: "Subdivision Test Family",
        family_slug: "",
        family_source: "",
        family_date: "",
      },
      active: false,
      onClick: () => {},
    };

    renderWithAppContext(SearchResult, searchResultProps);

    expect(await screen.findByRole("link", { name: "Australia" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New South Wales" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Queensland" })).toBeInTheDocument();
  });
});
