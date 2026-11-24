import { setupServer } from "msw/node";

import { backendApiSearchHandler } from "./api/backendApiHandlers";
import { configHandlers } from "./api/configHandlers";
import { taxonomyHandler } from "./api/taxonomyHandlers";

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...configHandlers, taxonomyHandler(), ...backendApiSearchHandler);
