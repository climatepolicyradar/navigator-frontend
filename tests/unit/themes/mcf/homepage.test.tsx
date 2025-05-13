import { render, screen } from "@testing-library/react";

import LandingPage from "../../../../themes/mcf/pages/homepage";

const mockHandleSearchInput = vi.fn();
const mockSearchInput = "mockSearchInput";

vi.mock("next/router", () => ({
  useRouter() {
    return { asPath: "", query: "" };
  },
}));

vi.mock("react-query", () => ({
  useQuery: vi.fn(() => ({
    data: {},
    isLoading: false,
    error: null,
  })),
}));

describe("Landing Page: ", () => {
  it("should render MCF Landing Page", () => {
    render(<LandingPage handleSearchInput={mockHandleSearchInput} searchInput={mockSearchInput} />);
    expect(screen.getByText("Multilateral Climate Funds")).toBeDefined();
  });
});
