import { createContext } from "react";

interface IFiltersLookupContext {
  inUse: boolean;
  searchTerm: string;
  matchingLabelPathSignatures: string[];
}

export const FiltersLookupContext = createContext<IFiltersLookupContext>({
  inUse: false,
  searchTerm: "",
  matchingLabelPathSignatures: [],
});
