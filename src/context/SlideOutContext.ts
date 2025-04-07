import { createContext } from "react";

export type TSlideOutContent = "concepts" | "";

type TProps = {
  currentSlideOut: TSlideOutContent;
  setCurrentSlideOut: (value: TSlideOutContent) => void;
};

export const SlideOutContext = createContext<TProps>(null);
