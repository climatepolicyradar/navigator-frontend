import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { renderWithContext } from "tests/mocks/renderWithContext";

import Search from "@/pages/search";

vi.mock("next/router", () => ({
  useRouter: () => {
    return {
      route: "/search",
      pathname: "/search",
      query: {},
      asPath: "/search",
    };
  },
}));

vi.mock("next/dynamic", () => ({
  default: () => {
    // Return a dummy component
    return function DummyComponent({ children }) {
      return <div>{children}</div>;
    };
  },
}));

describe("SearchPage", async () => {
  it("", async () => {
    const search_props = {
      theme: "cpr",
      themeConfig: {
        documentCategories: ["All"],
        features: { knowledgeGraph: false, searchFamilySummary: false },
        metadata: [
          {
            key: "search",
            title: "Law and Policy Search",
          },
        ],
      },
    };
    // @ts-ignore
    renderWithContext(Search, search_props);

    expect(screen.getByRole("heading", { level: 2, name: "Search results" })).toBeDefined();

    const countryFilterControl = await screen.findByText(/Published jurisdiction/i);

    expect(countryFilterControl).toBeDefined();
    fireEvent.click(countryFilterControl);

    const countryInput = screen.getByRole("textbox", {
      name: "Search for a jurisdiction",
    });

    expect(countryInput).toBeInTheDocument();
    userEvent.type(countryInput, "Country");
  });
});
