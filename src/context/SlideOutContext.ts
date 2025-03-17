import { createContext } from "react";

type TProps = {
  currentSlideOut: string;
  setCurrentSlideOut: (value: string) => void;
};

export const SlideOutContext = createContext<TProps>(null);
