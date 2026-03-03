import { test } from "@playwright/test";

import { runGenericDocumentTests } from "../generic/genericDocumentTests";

test.describe("CCC document page", () => {
  runGenericDocumentTests("ccc");
});
