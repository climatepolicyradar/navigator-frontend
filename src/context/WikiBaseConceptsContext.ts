import { createContext } from "react";

import { TConcept } from "@/types";

export const WikiBaseConceptsContext = createContext<TConcept[]>([]);
