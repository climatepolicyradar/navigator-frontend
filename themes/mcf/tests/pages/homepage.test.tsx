import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LandingPage from "../../pages/homepage";

const mockHandleSearchInput = jest.fn();
const mockSearchInput = "mockSearchInput";

jest.mock("next/router", () => ({
  useRouter() {
    return { asPath: "", query: "" };
  },
}));

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: {},
    isLoading: false,
    error: null,
  })),
}));

describe("Landing Page: ", () => {
  it("should render MCF Landing Page", () => {
    render(<LandingPage handleSearchInput={mockHandleSearchInput} searchInput={mockSearchInput} />);
    expect(screen.getByText("Multilateral Climate Funds")).toBeInTheDocument();
  });
});
