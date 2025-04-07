import { useContext, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Icon } from "@/components/atoms/icon/Icon";

import { SlideOutContext } from "@/context/SlideOutContext";

import { SLIDE_OUT_DATA_KEY } from "@/constants/dataAttributes";

interface SlideOutProps {
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const SlideOut = ({ children, showCloseButton = true }: SlideOutProps) => {
  const ref = useRef(null);
  const { currentSlideOut, setCurrentSlideOut } = useContext(SlideOutContext);

  // Clicking outside will close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check whether the clicked element is the slide out trigger for this slideout context
      const clickedElement = event.target as HTMLElement;
      if (ref.current && !ref.current.contains(event.target) && clickedElement.getAttribute(SLIDE_OUT_DATA_KEY) !== currentSlideOut) {
        setCurrentSlideOut("");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref, setCurrentSlideOut, currentSlideOut]);

  return (
    <AnimatePresence initial={false}>
      {currentSlideOut === "concepts" && (
        <motion.div
          ref={ref}
          key="slideOut"
          initial={{ translateX: "-100px" }}
          animate={{ opacity: 1, translateX: 0, transition: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          className="absolute top-0 left-full h-full bg-white p-5 pb-10 min-w-[400px]"
        >
          {showCloseButton && (
            <button className="absolute z-20 top-5 right-5" onClick={() => setCurrentSlideOut("")}>
              <Icon name="close" width="12" height="12" />
            </button>
          )}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
