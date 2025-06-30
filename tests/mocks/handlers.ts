import { configHandlers } from "./api/configHandlers";
import { searchHandlers } from "./api/searchHandlers";

export const handlers = [...configHandlers, ...searchHandlers];
