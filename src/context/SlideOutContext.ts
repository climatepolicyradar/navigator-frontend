import { createContext } from "react";

import { SLIDEOUT_VALUES } from "@/constants/slideOutValues";

// Derive the type from the values
export type TSlideOutContent = (typeof SLIDEOUT_VALUES)[number] | "";

interface IProps {
  currentSlideOut: TSlideOutContent;
  setCurrentSlideOut: (value: TSlideOutContent) => void;
}

export const SlideOutContext = createContext<IProps>(null);
