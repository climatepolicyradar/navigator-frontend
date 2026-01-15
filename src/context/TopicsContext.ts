import { createContext } from "react";

import { TTopics } from "@/types";

export const TopicsContext = createContext<TTopics>({
  rootTopics: [],
  topics: [],
});
