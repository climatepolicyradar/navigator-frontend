import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useRef } from "react";

import { Icon } from "@/components/atoms/icon/Icon";
import { SLIDE_OUT_DATA_KEY } from "@/constants/dataAttributes";
import { SlideOutContext } from "@/context/SlideOutContext";

interface IProps {
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const SlideOut = ({ children, showCloseButton = true }: IProps) => {
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
      {currentSlideOut !== "" && (
        <motion.div
          ref={ref}
          key="slideOut"
          initial={{ translateX: "-100px" }}
          animate={{
            opacity: 1,
            translateX: 0,
            transition: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
          }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          className="absolute z-20 top-0 left-0 h-full bg-white p-5 pb-[180px] w-screen md:px-9 md:z-0 md:w-auto md:min-w-[460px] md:left-full md:pb-0 md:border-r md:border-gray-300"
        >
          {showCloseButton && (
            <button className="absolute z-20 top-5 right-5" onClick={() => setCurrentSlideOut("")}>
              <Icon name="close" width="12" height="12" />
            </button>
          )}
          <div className="mb-5 md:hidden">
            <button
              className="flex items-center gap-2 text-sm text-text-secondary opacity-50 hover:opacity-100"
              onClick={() => setCurrentSlideOut("")}
            >
              <ArrowLeft /> Back
            </button>
          </div>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
