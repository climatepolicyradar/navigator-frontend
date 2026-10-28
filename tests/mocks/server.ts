import { setupServer } from "msw/node";

import { backendApiSearchHandler } from "./api/backendApiHandlers";
import { conceptHandlers } from "./api/conceptHandlers";
import { configHandlers } from "./api/configHandlers";
import { dataInHandlers } from "./api/dataInHandlers";
import { geographiesHandlers } from "./api/geographiesHandlers";
import { searchHandlers } from "./api/searchHandlers";

// This configures a request mocking server with the given request handlers.
export const server = setupServer(
  ...configHandlers,
  ...geographiesHandlers,
  ...searchHandlers,
  ...conceptHandlers,
  ...dataInHandlers,
  ...backendApiSearchHandler
);
