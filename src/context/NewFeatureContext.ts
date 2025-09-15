import { createContext } from "react";

interface IProps {
  displayNewFeature: number | null; // The feature order number to show the modal for. null = none yet, -1 = none now (closed)
  setDisplayNewFeature: (order: number | null) => void;
  previousNewFeature: number | null; // The last feature that the user saw. -1 = none, null = uninitialised
  setPreviousNewFeature: (order: number) => void;
}

export const NewFeatureContext = createContext<IProps>({
  displayNewFeature: null,
  setDisplayNewFeature: (_order) => {},
  previousNewFeature: null,
  setPreviousNewFeature: (_order) => {},
});
