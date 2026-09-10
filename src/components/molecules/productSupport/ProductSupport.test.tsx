import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductSupport } from "./ProductSupport";

const openDrawer = () => userEvent.click(screen.getByRole("button", { name: "Product support" }));

describe("ProductSupport", () => {
  it("opens the drawer when the button is pressed", async () => {
    render(<ProductSupport content="mostRecent">Product support</ProductSupport>);

    expect(screen.queryByRole("button", { name: "How do we assign dates to documents?" })).not.toBeInTheDocument();

    await openDrawer();

    expect(await screen.findByRole("button", { name: "How do we assign dates to documents?" })).toBeInTheDocument();
  });

  it("opens all FAQ items by default when there are fewer than 4", async () => {
    render(<ProductSupport content="mostRecent">Product support</ProductSupport>);

    await openDrawer();

    expect(await screen.findByRole("button", { name: "How do we assign dates to documents?" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Which date does sorting by ‘most recent’ sort by?" })).toHaveAttribute("aria-expanded", "true");
  });

  it("opens only the first FAQ item by default when there are 4 or more", async () => {
    render(<ProductSupport content="topics">Product support</ProductSupport>);

    await openDrawer();

    expect(await screen.findByRole("button", { name: "Searching Topics within documents" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "How should I use this feature?" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "What happens if I select multiple Topics or add a text search?" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByRole("button", { name: "Where can I find out more about the Topics feature?" })).toHaveAttribute("aria-expanded", "false");
  });
});
