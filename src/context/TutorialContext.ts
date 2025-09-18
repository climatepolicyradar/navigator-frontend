import { createContext } from "react";

import { TTutorialName } from "@/types";

interface IProps {
  displayTutorial: TTutorialName | null; // The tutorial to snow the modal for
  setDisplayTutorial: (name: TTutorialName | null) => void;
  completedTutorials: TTutorialName[]; // Tutorials the user has dismissed
  addCompletedTutorial: (name: TTutorialName) => void;
}

export const TutorialContext = createContext<IProps>({
  displayTutorial: null,
  setDisplayTutorial: (_name) => {},
  completedTutorials: [],
  addCompletedTutorial: (_name) => {},
});
