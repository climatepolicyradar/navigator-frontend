import { createContext } from "react";

export type TSlideOutContent = "concepts" | "";

interface IProps {
  currentSlideOut: TSlideOutContent;
  setCurrentSlideOut: (value: TSlideOutContent) => void;
}

export const SlideOutContext = createContext<IProps>(null);
