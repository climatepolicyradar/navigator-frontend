import { screen } from "@testing-library/react";

import { renderWithAppContext } from "@/mocks/renderWithAppContext";
import { TMatchedFamily } from "@/types";

import SearchResult from "./SearchResult";

type TSearchResultProps = {
  family: TMatchedFamily;
  active: boolean;
  onClick?: () => void;
};

describe("SearchResult", () => {
  it("displays all geographies as links if family has multiple geographies", async () => {
    const searchResultProps: TSearchResultProps = {
      family: {
        corpus_import_id: "1",
        family_description_match: false,
        family_title_match: false,
        total_passage_hits: 0,
        corpus_type_name: "Reports",
        family_category: "REPORTS",
        family_description: "",
        family_documents: [],
        family_geographies: ["AUS", "ARG"],
        metadata: [],
        family_name: "Multi-geo Test Family",
        family_slug: "",
        family_source: "",
        family_date: "",
      },
      active: false,
      onClick: () => {},
    };

    renderWithAppContext(SearchResult, { ...searchResultProps, themeConfig: { features: {} } });

    expect(await screen.findByRole("link", { name: "Australia" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Argentina" })).toBeInTheDocument();
  });

  it("displays all subdivision links if family has subdivision geographies", async () => {
    const searchResultProps: TSearchResultProps = {
      family: {
        corpus_import_id: "1",
        family_description_match: false,
        family_title_match: false,
        total_passage_hits: 0,
        corpus_type_name: "Reports",
        family_category: "REPORTS",
        family_description: "",
        family_documents: [],
        family_geographies: ["AUS", "AU-NSW", "AU-QLD"],
        metadata: [],
        family_name: "Subdivision Test Family",
        family_slug: "",
        family_source: "",
        family_date: "",
      },
      active: false,
      onClick: () => {},
    };

    renderWithAppContext(SearchResult, { ...searchResultProps, themeConfig: { features: {} } });

    const countryLink = await screen.findByRole("link", { name: "Australia" });
    const subdivisionLink1 = screen.getByRole("link", { name: "New South Wales" });
    const subdivisionLink2 = screen.getByRole("link", { name: "Queensland" });

    expect(countryLink).toBeInTheDocument();
    expect(subdivisionLink1).toBeInTheDocument();
    expect(subdivisionLink2).toBeInTheDocument();

    expect(countryLink).toHaveAttribute("href", "/geographies/australia");
    expect(subdivisionLink1).toHaveAttribute("href", "/geographies/au-nsw");
    expect(subdivisionLink2).toHaveAttribute("href", "/geographies/au-qld");
  });
});
