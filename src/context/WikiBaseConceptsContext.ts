import { createContext } from "react";

import { TTopic } from "@/types";

export const WikiBaseConceptsContext = createContext<TTopic[]>([]);
