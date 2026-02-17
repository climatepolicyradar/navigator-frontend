import { test } from "@playwright/test";

import { runGenericGeographyTests } from "../generic/genericGeographyTests";

test.describe("CPR geography page", () => {
  runGenericGeographyTests();
});
