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

  it.only("displays subdivision name if family has a subdivision geography", async () => {
    const searchResultProps = {
      themeConfig: { features: {} },
      family: {
        corpus_type_name: "",
        family_category: "",
        family_description: "",
        family_documents: [],
        family_geographies: ["AUS", "AU-NSW"],
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
  });
});
