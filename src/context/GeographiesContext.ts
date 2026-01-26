import { createContext } from "react";

import { GeographyV2 } from "@/types";

export const GeographiesContext = createContext<GeographyV2[]>([]);
