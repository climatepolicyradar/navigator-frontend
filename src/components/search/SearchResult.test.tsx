import { screen } from "@testing-library/react";

import { DEFAULT_FEATURES } from "@/constants/features";
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

    renderWithAppContext(SearchResult, { pageProps: { ...searchResultProps, themeConfig: { features: {} } } });

    expect(await screen.findByRole("link", { name: "Australia" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Argentina" })).toBeInTheDocument();
  });

  it("displays country and subdivision links up to the display limit", async () => {
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

    renderWithAppContext(SearchResult, {
      pageProps: { ...searchResultProps, themeConfig: { features: {} } },
      features: { ...DEFAULT_FEATURES, subdivisions: true },
    });

    const countryLink = await screen.findByRole("link", { name: "Australia" });
    const subdivisionLink = screen.getByRole("link", { name: "New South Wales" });

    expect(countryLink).toHaveAttribute("href", "/geographies/australia");
    expect(subdivisionLink).toHaveAttribute("href", "/geographies/au-nsw");
    expect(screen.queryByRole("link", { name: "Queensland" })).not.toBeInTheDocument();
    expect(screen.getByText("+1", { exact: false })).toBeInTheDocument();
  });
});
