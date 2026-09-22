import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as nextRouterMock from "next-router-mock";

import { ThemeContext } from "@/context/ThemeContext";
import { TSearchQueryGroup, TThemeConfig } from "@/types";

import { DownloadSearch } from "./DownloadSearch";

vi.mock("next/router", () => nextRouterMock);

const mockCapture = vi.hoisted(() => vi.fn());
vi.mock("posthog-js/react", () => ({ usePostHog: () => ({ capture: mockCapture }) }));

const DOWNLOAD_URL = "https://form.jotform.com/250202141318339";
const themeConfig = { links: { downloadDatabase: DOWNLOAD_URL } } as TThemeConfig;

const emptyFilters: TSearchQueryGroup = { op: "and", filters: [] };

const renderDownloadSearch = (overrides: Partial<React.ComponentProps<typeof DownloadSearch>> = {}) =>
  render(
    <ThemeContext.Provider value={{ theme: "cpr", themeConfig, loaded: true }}>
      <DownloadSearch hasSearch={false} query="" filters={emptyFilters} sort="relevance" totalResults={null} {...overrides} />
    </ThemeContext.Provider>
  );

describe("DownloadSearch", () => {
  beforeEach(() => mockCapture.mockClear());

  it("captures a download event when all data is downloaded", async () => {
    const user = userEvent.setup();

    renderDownloadSearch();
    await user.click(screen.getByRole("button", { name: "Download" }));
    await user.click(screen.getByRole("link", { name: "All data" }));

    expect(mockCapture).toHaveBeenCalledTimes(1);
    expect(mockCapture).toHaveBeenCalledWith("search:download_click", { download_type: "all_data", download_url: DOWNLOAD_URL });
  });

  it("captures nothing until a download is chosen", async () => {
    const user = userEvent.setup();

    renderDownloadSearch();
    await user.click(screen.getByRole("button", { name: "Download" }));

    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("keeps 'This search only' disabled when there is no active search", async () => {
    const user = userEvent.setup();
    renderDownloadSearch({ hasSearch: false });

    await user.click(screen.getByRole("button", { name: "Download" }));

    expect(screen.getByRole("button", { name: "This search only" })).toBeDisabled();
  });

  it("enables 'This search only' when there is an active search", async () => {
    const user = userEvent.setup();
    renderDownloadSearch({ hasSearch: true });

    await user.click(screen.getByRole("button", { name: "Download" }));

    expect(screen.getByRole("button", { name: "This search only" })).not.toBeDisabled();
  });

  it("opens the download modal when 'This search only' is clicked", async () => {
    const user = userEvent.setup();
    renderDownloadSearch({ hasSearch: true, totalResults: 42 });

    await user.click(screen.getByRole("button", { name: "Download" }));
    await user.click(screen.getByRole("button", { name: "This search only" }));

    expect(document.body).toHaveClass("overflow-hidden");
    expect(screen.getByRole("button", { name: "Download 42 results" })).toBeInTheDocument();
  });

  it("closes the modal once the download succeeds", async () => {
    // The Modal atom keeps its content mounted and closes only via CSS (a body scroll-lock
    // class toggles with it), so "closed" is asserted through that side effect rather than
    // the title leaving the DOM.
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(new Blob(["x"]), { status: 200 }));
    window.URL.createObjectURL = vi.fn(() => "blob:mock");
    const user = userEvent.setup();
    renderDownloadSearch({ hasSearch: true, totalResults: 10 });

    await user.click(screen.getByRole("button", { name: "Download" }));
    await user.click(screen.getByRole("button", { name: "This search only" }));
    expect(document.body).toHaveClass("overflow-hidden");

    await user.click(screen.getByRole("button", { name: "Download 10 results" }));

    await waitFor(() => expect(document.body).not.toHaveClass("overflow-hidden"));
  });

  it("reopens correctly after a previous download succeeded", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(new Blob(["x"]), { status: 200 }));
    window.URL.createObjectURL = vi.fn(() => "blob:mock");
    const user = userEvent.setup();
    renderDownloadSearch({ hasSearch: true, totalResults: 10 });

    await user.click(screen.getByRole("button", { name: "Download" }));
    await user.click(screen.getByRole("button", { name: "This search only" }));
    await user.click(screen.getByRole("button", { name: "Download 10 results" }));
    await waitFor(() => expect(document.body).not.toHaveClass("overflow-hidden"));

    await user.click(screen.getByRole("button", { name: "Download" }));
    await user.click(screen.getByRole("button", { name: "This search only" }));

    expect(document.body).toHaveClass("overflow-hidden");
    expect(screen.getByRole("button", { name: "Download 10 results" })).toBeInTheDocument();
  });
});
