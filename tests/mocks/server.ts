import { setupServer } from "msw/node";

import { testHandler } from "@/tests/core/api/geography-counts.test";

import { backendApiSearchHandler } from "./api/backendApiHandlers";
import { conceptHandlers } from "./api/conceptHandlers";
import { configHandlers } from "./api/configHandlers";
import { familiesHandlers } from "./api/familiesHandlers";
import { geographiesHandlers } from "./api/geographiesHandlers";
import { searchHandlers } from "./api/searchHandlers";

// This configures a request mocking server with the given request handlers.
export const server = setupServer(
  ...configHandlers,
  ...geographiesHandlers,
  ...searchHandlers,
  ...conceptHandlers,
  ...familiesHandlers,

  ...testHandler,
  ...backendApiSearchHandler
);
