import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as nextRouterMock from "next-router-mock";

import { DownloadSearchModal } from "./DownloadSearchModal";

vi.mock("next/router", () => nextRouterMock);

describe("DownloadSearchModal", () => {
  const renderModal = (overrides: Partial<React.ComponentProps<typeof DownloadSearchModal>> = {}) =>
    render(<DownloadSearchModal isOpen onClose={vi.fn()} onDownload={vi.fn()} status="idle" totalResults={332} {...overrides} />);

  it("shows the exact result count when under the cap", () => {
    renderModal({ totalResults: 332 });

    expect(screen.getByRole("button", { name: "Download 332 results" })).toBeInTheDocument();
  });

  it("caps the button label at 500 when there are more results than the cap", () => {
    renderModal({ totalResults: 9102 });

    expect(screen.getByRole("button", { name: "Download first 500 results" })).toBeInTheDocument();
  });

  it("shows a plain 0-result label when there is no count yet", () => {
    renderModal({ totalResults: null });

    expect(screen.getByRole("button", { name: "Download 0 results" })).toBeInTheDocument();
  });

  it("calls onDownload when the download button is clicked", async () => {
    const onDownload = vi.fn();
    const user = userEvent.setup();
    renderModal({ onDownload });

    await user.click(screen.getByRole("button", { name: "Download 332 results" }));

    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderModal({ onClose });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("disables the download button while loading", () => {
    renderModal({ status: "loading" });

    expect(screen.getByRole("button", { name: "Download 332 results" })).toBeDisabled();
  });

  it("shows an inline error and keeps the button enabled for retry", () => {
    renderModal({ status: "error" });

    expect(screen.getByText("There was an error downloading the CSV. Please try again.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download 332 results" })).not.toBeDisabled();
  });

  it("shows no error message when idle", () => {
    renderModal({ status: "idle" });

    expect(screen.queryByText("There was an error downloading the CSV. Please try again.")).not.toBeInTheDocument();
  });
});
