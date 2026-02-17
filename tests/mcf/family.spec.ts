import { test } from "@playwright/test";

import { runGenericFamilyTests } from "../generic/genericFamilyTests";

test.describe("MCF family page", () => {
  runGenericFamilyTests("mcf");
});
