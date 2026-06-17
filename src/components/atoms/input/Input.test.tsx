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

  it("does not render a clear button when clearable is false", () => {
    render(<Input clearable={false} value="some text" onChange={vi.fn()} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides the clear button when clearable is true but value is empty", () => {
    render(<Input clearable value="" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveClass("hidden");
  });

  it("shows the clear button when clearable is true and value is set", () => {
    render(<Input clearable value="some text" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).not.toHaveClass("hidden");
  });

  it("calls onClear when the clear button is clicked", async () => {
    const onClear = vi.fn();
    render(<Input clearable value="some text" onChange={vi.fn()} onClear={onClear} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("renders icon before the input by default", () => {
    const icon = <span data-cy="icon">icon</span>;
    render(<Input icon={icon} />);
    const input = screen.getByRole("textbox");
    const renderedIcon = screen.getByTestId("icon");
    expect(input.compareDocumentPosition(renderedIcon)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });

  it("renders icon after the input when iconSide is right", () => {
    const icon = <span data-cy="icon">icon</span>;
    render(<Input icon={icon} iconSide="right" />);
    const input = screen.getByRole("textbox");
    const renderedIcon = screen.getByTestId("icon");
    expect(input.compareDocumentPosition(renderedIcon)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("calls onChange when the user types", async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalled();
  });
});
