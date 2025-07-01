import { configHandlers } from "./api/configHandlers";
import { geographiesHandlers } from "./api/geographiesHandlers";
import { searchHandlers } from "./api/searchHandlers";

export const handlers = [...configHandlers, ...geographiesHandlers, ...searchHandlers];
