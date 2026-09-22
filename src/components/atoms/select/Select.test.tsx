import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Select } from "./Select";

const OPTIONS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

// Base UI has a slight delay when displaying the Popup
const openPopup = async () => {
  await userEvent.click(screen.getByRole("combobox"));
  await waitFor(() => expect(screen.getByRole("listbox")).toBeVisible());
};

describe("Select", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the trigger", () => {
    render(<Select options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows the default value in the trigger", () => {
    render(<Select options={OPTIONS} defaultValue="b" />);
    // Base UI renders the raw value in the trigger until the popup mounts its items
    expect(screen.getByDisplayValue("b")).toBeInTheDocument();
  });

  it("opens the popup and shows options when the trigger is clicked", async () => {
    render(<Select options={OPTIONS} />);
    await openPopup();

    expect(screen.getAllByRole("option")).toHaveLength(OPTIONS.length);
  });

  it("does not render options when the options list is empty", async () => {
    render(<Select options={[]} />);
    await openPopup();

    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  /*
    TODO: add test for the onChange callback when an option is selected
    Currently running into an issue with how base-ui uses portals to render the select options
  */
});
