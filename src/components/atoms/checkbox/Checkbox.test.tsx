import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("does not call onCheckedChange when disabled and clicked", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Test" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("calls onCheckedChange when clicked and not disabled", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Test" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });
});
