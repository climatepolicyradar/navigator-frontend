import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import LandingPage from "../../pages/homepage";

describe("Landing Page: ", () => {
  it("should render hello world", () => {
    render(<LandingPage />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
