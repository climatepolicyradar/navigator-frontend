import { test } from "@playwright/test";

import { runGenericGeographyTests } from "../generic/genericGeographyTests";

test.describe("MCF geography page", () => {
  runGenericGeographyTests();
});
