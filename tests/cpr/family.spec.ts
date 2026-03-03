import { test } from "@playwright/test";

import { runGenericFamilyTests } from "../generic/genericFamilyTests";

test.describe("CPR family page", () => {
  runGenericFamilyTests("cpr");
});
