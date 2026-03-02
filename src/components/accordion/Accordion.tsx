import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Heading } from "./Heading";

interface IProps {
  title: string;
  startOpen?: boolean;
  open?: boolean;
  overflowOverride?: boolean;
  children: React.ReactNode;
  className?: string;
  showFade?: "true" | "false";
  fixedHeight?: string;
  headContent?: React.ReactNode;
}

export const Accordion = ({
  title,
  startOpen = false,
  open,
  overflowOverride,
  fixedHeight = "300px",
  children,
  showFade = "false",
  headContent,
  ...props
}: IProps) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  useEffect(() => {
    if (open === undefined) return;
    setIsOpen(open);
  }, [open]);

  return (
    <div {...props}>
      <button
        type="button"
        className={`w-full flex items-center justify-between cursor-pointer group`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={title}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Heading>{title}</Heading>
          {headContent}
        </div>
        <span className="text-textDark opacity-40 group-hover:opacity-100">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              collapsed: { opacity: 0, height: 0, marginTop: 0 },
              open: { opacity: 1, height: "auto", marginTop: "14px" },
            }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div
              className={`relative max-h-[${fixedHeight}] ${
                overflowOverride
                  ? "overflow-visible"
                  : "overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500"
              } `}
            >
              <>
                {children}
                {showFade === "true" && <span className="h-[34px] sticky block bottom-0 w-full bg-gradient-to-b from-transparent to-white"></span>}
              </>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
