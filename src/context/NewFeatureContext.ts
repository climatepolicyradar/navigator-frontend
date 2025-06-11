import { createContext } from "react";

interface IProps {
  displayNewFeature: number | null;
  setDisplayNewFeature: (order: number | null) => void;
  previousNewFeature: number | null;
  setPreviousNewFeature: (order: number) => void;
  hasShownModal: boolean;
  setHasShownModal: (shown: boolean) => void;
}

export const NewFeatureContext = createContext<IProps>({
  displayNewFeature: null,
  setDisplayNewFeature: (_order) => {},
  previousNewFeature: null,
  setPreviousNewFeature: (_order) => {},
  hasShownModal: false,
  setHasShownModal: (_shown) => {},
});
