import { SlideOutContext } from "@/context/SlideOutContext";
import { useContext } from "react";

interface SlideOutProps {
  children: React.ReactNode;
}

export const SlideOut = ({ children }: SlideOutProps) => {
  const { currentSlideOut, setCurrentSlideOut } = useContext(SlideOutContext);

  if (!currentSlideOut) return null;

  return (
    <div className="absolute top-0 left-full h-full bg-white border border-red-600 p-4 min-w-[400px]">
      Slide out content <div onClick={() => setCurrentSlideOut("")}>CLOSE</div>
      <div>{children}</div>
    </div>
  );
};
