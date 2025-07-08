import { createContext } from "react";

export type TSlideOutContent = "concepts" | "familyConcepts" | "";

interface IProps {
  currentSlideOut: TSlideOutContent;
  setCurrentSlideOut: (value: TSlideOutContent) => void;
}

export const SlideOutContext = createContext<IProps>(null);
