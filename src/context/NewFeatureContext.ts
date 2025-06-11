import { createContext } from "react";

interface IProps {
  displayNewFeature: number | null;
  setDisplayNewFeature: (order: number | null) => void;
  previousNewFeature: number | null;
  setPreviousNewFeature: (order: number) => void;
}

export const NewFeatureContext = createContext<IProps>({
  displayNewFeature: null,
  setDisplayNewFeature: (_order) => {},
  previousNewFeature: null,
  setPreviousNewFeature: (_order) => {},
});
