import { createContext } from "react";

interface IProps {
  displayTutorial: number | null; // The tutorial order number to show the modal for. null = none yet, -1 = none now (closed)
  setDisplayTutorial: (order: number | null) => void;
  previousTutorial: number | null; // The last tutorial that the user saw. -1 = none, null = uninitialised
  setPreviousTutorial: (order: number) => void;
}

export const TutorialContext = createContext<IProps>({
  displayTutorial: null,
  setDisplayTutorial: (_order) => {},
  previousTutorial: null,
  setPreviousTutorial: (_order) => {},
});
