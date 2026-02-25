import { test } from "@playwright/test";

import { runGenericDocumentTests } from "../generic/genericDocumentTests";

test.describe("CPR document page", () => {
  runGenericDocumentTests("cpr");
});
