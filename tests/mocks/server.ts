import { setupServer } from "msw/node";

import { configHandlers } from "./api/configHandlers";
import { geographiesHandlers } from "./api/geographiesHandlers";
import { searchHandlers } from "./api/searchHandlers";

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...configHandlers, ...geographiesHandlers, ...searchHandlers);
