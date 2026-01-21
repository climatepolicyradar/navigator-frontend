vi.mock("next/router", () => require("next-router-mock"));

import { expect, test } from "vitest";

import CPRthemeConfig from "@/cpr/config";
import LandingPage from "@/cpr/pages/homepage";
import { renderWithAppContext } from "@/mocks/renderWithAppContext";

test("CPR homepage looks correct", () => {
  const homepage = renderWithAppContext(LandingPage, { pageProps: { themeConfig: CPRthemeConfig } });

  expect(homepage).toMatchSnapshot("cpr-homepage");
});
