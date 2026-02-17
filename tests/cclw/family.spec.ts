import { test } from "@playwright/test";

import { runGenericFamilyTests } from "../generic/genericFamilyTests";

test.describe("CCLW family page", () => {
  runGenericFamilyTests("cclw");
});
