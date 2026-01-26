import { createContext } from "react";

import { TTutorialName } from "@/types";

export type TTutorialContext = {
  displayTutorial: TTutorialName | null; // The tutorial to snow the modal for
  setDisplayTutorial: (name: TTutorialName | null) => void;
  completedTutorials: TTutorialName[]; // Tutorials the user has dismissed
  addCompletedTutorial: (name: TTutorialName) => void;
};

export const TutorialContext = createContext<TTutorialContext>({
  displayTutorial: null,
  setDisplayTutorial: (_name) => {},
  completedTutorials: [],
  addCompletedTutorial: (_name) => {},
});
