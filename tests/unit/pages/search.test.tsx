vi.mock("next/router", () => require("next-router-mock"));

import { fireEvent, screen, within } from "@testing-library/react";
import React from "react";
import { renderWithContext } from "tests/mocks/renderWithContext";

import Search from "@/pages/search";

vi.mock("next/dynamic", () => ({
  default: () => {
    // Return a dummy component
    return function DummyComponent({ children }) {
      return <div>{children}</div>;
    };
  },
}));

describe("SearchPage", async () => {
  it("filters search results by country", async () => {
    const search_props = {
      initialUrl: "/search",
      initialQuery: {},
      envConfig: {
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
      },
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

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeDefined();

    const countryFilterControl = await screen.findByText(/Published jurisdiction/i);

    expect(countryFilterControl).toBeDefined();
    fireEvent.click(countryFilterControl);

    const countryInput = screen.getByRole("textbox", {
      name: "Search for a jurisdiction",
    });

    expect(countryInput).toBeInTheDocument();
    fireEvent.change(countryInput, { target: { value: "Belize" } });
    expect(countryInput).toHaveValue("Belize");

    const countryOptions = within(screen.getByTestId("countries")).getAllByRole("listitem");
    expect(countryOptions).toHaveLength(1);
    fireEvent.click(countryOptions[0]);

    expect(await screen.findByText("Results")).toBeDefined();
    expect(screen.getByText("Belize Nationally Determined Contribution. NDC3 (Update)")).toBeDefined();
    expect(screen.queryByText("Argentina Biennial Transparency Report. BTR1")).toBeNull();
  });
});
