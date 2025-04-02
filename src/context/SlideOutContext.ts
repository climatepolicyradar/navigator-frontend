import { createContext } from "react";

type TSlideOutContent = "concepts" | "";

type TProps = {
  currentSlideOut: TSlideOutContent;
  setCurrentSlideOut: (value: TSlideOutContent) => void;
};

export const SlideOutContext = createContext<TProps>(null);
