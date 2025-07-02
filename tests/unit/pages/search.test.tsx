import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithAppContext } from "tests/mocks/renderWithAppContext";

import Search from "@/pages/search";

describe("SearchPage", async () => {
  it("filters search results by country", async () => {
    const search_props = {
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
    renderWithAppContext(Search, search_props);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeDefined();

    const countryFilterControl = await screen.findByText(/Published jurisdiction/i);

    expect(countryFilterControl).toBeDefined();
    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(countryFilterControl);
    });

    const countryInput = screen.getByRole("textbox", {
      name: "Search for a jurisdiction",
    });

    expect(countryInput).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(countryInput, "Belize");
    });
    expect(countryInput).toHaveValue("Belize");

    const countryOptions = within(screen.getByTestId("countries")).getAllByRole("listitem");
    expect(countryOptions).toHaveLength(1);

    await act(async () => {
      await userEvent.click(countryOptions[0]);
    });

    expect(await screen.findByText("Results")).toBeDefined();
    expect(screen.getByText("Belize Nationally Determined Contribution. NDC3 (Update)")).toBeDefined();
    expect(screen.queryByText("Argentina Biennial Transparency Report. BTR1")).toBeNull();
  });
});
