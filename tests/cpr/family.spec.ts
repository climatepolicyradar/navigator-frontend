import { test } from "@playwright/test";

import { runGenericFamilyTests } from "../generic/genericFamilyTests";

test.describe("CPR family page", () => {
  runGenericFamilyTests("cpr");
});

/**
 * TODO
 * - Run tests against an amount of families/cases generically
 * -- Not going to be the best solution for every test - some specific ones will be needed
 * -- Move test into a function that runs against the families it is given
 * --
 */
