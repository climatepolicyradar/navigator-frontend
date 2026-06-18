import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("displays the label", () => {
    render(<Checkbox onCheckedChange={vi.fn()}>My label</Checkbox>);
    expect(screen.getByText("My label")).toBeInTheDocument();
  });

  it("does not call onCheckedChange when disabled and clicked", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox disabled onCheckedChange={onCheckedChange}>
        Test
      </Checkbox>
    );
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("calls onCheckedChange when clicked and not disabled", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange}>Test</Checkbox>);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });
});
