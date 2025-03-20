import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Icon } from "@/components/atoms/icon/Icon";

import { SlideOutContext } from "@/context/SlideOutContext";

interface SlideOutProps {
  children: React.ReactNode;
}

export const SlideOut = ({ children }: SlideOutProps) => {
  const { currentSlideOut, setCurrentSlideOut } = useContext(SlideOutContext);

  return (
    <AnimatePresence initial={false}>
      {currentSlideOut === "concepts" && (
        <motion.div
          key="slideOut"
          initial={{ translateX: "-100px" }}
          animate={{ opacity: 1, translateX: 0, transition: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] } }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          className="absolute top-0 left-full h-full bg-white p-5 pt-10 min-w-[400px]"
        >
          <button className="absolute top-5 right-5" onClick={() => setCurrentSlideOut("")}>
            <Icon name="close" width="12" height="12" />
          </button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
