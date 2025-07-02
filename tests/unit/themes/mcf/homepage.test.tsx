import { screen } from "@testing-library/react";
import { renderWithAppContext } from "tests/mocks/renderWithAppContext";

import LandingPage from "../../../../themes/mcf/pages/homepage";

const mockHandleSearchInput = vi.fn();
const mockSearchInput = "mockSearchInput";

describe("Landing Page: ", () => {
  it("renders the MCF Landing Page", () => {
    const landingPageProps = { handleSearchInput: mockHandleSearchInput, searchInput: mockSearchInput };

    renderWithAppContext(LandingPage, landingPageProps);

    expect(screen.getByText("Multilateral Climate Funds")).toBeDefined();
  });
});
