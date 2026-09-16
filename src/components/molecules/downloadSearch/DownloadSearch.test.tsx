import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as nextRouterMock from "next-router-mock";

import { ThemeContext } from "@/context/ThemeContext";
import { TThemeConfig } from "@/types";

import { DownloadSearch } from "./DownloadSearch";

vi.mock("next/router", () => nextRouterMock);

const mockCapture = vi.hoisted(() => vi.fn());
vi.mock("posthog-js/react", () => ({ usePostHog: () => ({ capture: mockCapture }) }));

const DOWNLOAD_URL = "https://form.jotform.com/250202141318339";
const themeConfig = { links: { downloadDatabase: DOWNLOAD_URL } } as TThemeConfig;

const renderDownloadSearch = () =>
  render(
    <ThemeContext.Provider value={{ theme: "cpr", themeConfig, loaded: true }}>
      <DownloadSearch />
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
});
