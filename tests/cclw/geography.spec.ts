import { test } from "@playwright/test";

import { runGenericGeographyTests } from "../generic/genericGeographyTests";

test.describe("CCLW geography page", () => {
  runGenericGeographyTests("cclw");
});
