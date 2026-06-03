import { render, screen } from "@testing-library/react";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders without crashing", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });
});
