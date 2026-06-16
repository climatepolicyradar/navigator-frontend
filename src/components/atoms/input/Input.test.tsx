import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("passes props through to the input element", () => {
    render(<Input placeholder="Search..." disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Search...");
    expect(input).toBeDisabled();
  });

  it("hides the clear button when the value is empty", () => {
    render(<Input value="" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveClass("hidden");
  });

  it("shows the clear button when a value is set", () => {
    render(<Input value="some text" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).not.toHaveClass("hidden");
  });

  it("calls onClear when the clear button is clicked", async () => {
    const onClear = vi.fn();
    render(<Input value="some text" onChange={vi.fn()} onClear={onClear} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("calls onChange when the user types", async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalled();
  });
});
