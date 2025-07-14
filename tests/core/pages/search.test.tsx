import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithAppContext } from "@/mocks/renderWithAppContext";
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

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    const geographyFilterControl = await screen.findByRole("button", { name: /Geography/ });

    expect(geographyFilterControl).toBeInTheDocument();
    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(geographyFilterControl);
    });

    expect(await screen.findByText(/Published jurisdiction/i));

    await act(async () => {
      await userEvent.click(await screen.findByRole("checkbox", { name: "Belize" }));
    });

    const countryOptions = within(screen.getByTestId("countries")).getAllByRole("checkbox");
    expect(countryOptions).toHaveLength(3);

    expect(await screen.findByText("Results")).toBeInTheDocument();
    expect(screen.getByText("Belize Nationally Determined Contribution. NDC3 (Update)")).toBeInTheDocument();
    expect(screen.queryByText("Argentina Biennial Transparency Report. BTR1")).not.toBeInTheDocument();
  });

  it("filters search results by region", async () => {
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

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    const geographyFilterControl = await screen.findByRole("button", { name: /Geography/ });

    expect(geographyFilterControl).toBeInTheDocument();
    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(geographyFilterControl);
    });

    expect(await screen.findByText(/Region/i)).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(await screen.findByRole("checkbox", { name: "Latin America & Caribbean" }));
    });

    expect(await screen.findByText("Results")).toBeInTheDocument();
    expect(screen.getByText("Argentina Biennial Transparency Report. BTR1")).toBeInTheDocument();
    expect(screen.getByText("Belize Nationally Determined Contribution. NDC3 (Update)")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Technical analysis of the first biennial update report of Afghanistan submitted on 13 October 2019. Summary report by the team of technical experts"
      )
    ).not.toBeInTheDocument();
  });

  it("shows topics filters when topics slideout is opened", async () => {
    const search_props = {
      envConfig: {
        BACKEND_API_URL: process.env.BACKEND_API_URL,
        CONCEPTS_API_URL: process.env.CONCEPTS_API_URL,
      },
      theme: "cpr",
      themeConfig: {
        documentCategories: ["All"],
        features: { knowledgeGraph: true, searchFamilySummary: false },
        metadata: [
          {
            key: "search",
            title: "Law and Policy Search",
          },
        ],
      },
      conceptsData: [{}],
    };
    // @ts-ignore
    renderWithAppContext(Search, search_props);

    expect(await screen.findByRole("heading", { level: 2, name: "Search results" })).toBeInTheDocument();

    const topicsFilterControl = await screen.findByRole("button", { name: /Topics/ });

    expect(topicsFilterControl).toBeInTheDocument();
    // We have to wrap our user interactions in act() here due to some async updates that happen in the component,
    // like animations that were causing warnings in the console.
    await act(async () => {
      await userEvent.click(topicsFilterControl);
    });

    expect(await screen.findByText(/Find mentions of topics/i));
  });
});
