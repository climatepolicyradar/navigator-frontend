import { test } from "@playwright/test";

import { runGenericDocumentTests } from "../generic/genericDocumentTests";

test.describe("CCLW document page", () => {
  runGenericDocumentTests("cclw");
});
