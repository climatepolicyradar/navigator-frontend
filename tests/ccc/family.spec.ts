import { test } from "@playwright/test";

import { runGenericFamilyTests } from "../generic/genericFamilyTests";

test.describe("CCC family page", () => {
  runGenericFamilyTests("ccc");
});
