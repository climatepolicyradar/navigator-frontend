import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Heading } from "./Heading";

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Label } from "@components/labels/Label";

type TProps = {
  title: string;
  startOpen?: boolean;
  overflowOverride?: boolean;
  children: React.ReactNode;
  className?: string;
  showFade?: "true" | "false";
  fixedHeight?: string;
  isBeta?: boolean;
};

export const Accordian = ({
  title,
  startOpen = false,
  overflowOverride,
  fixedHeight = "300px",
  children,
  showFade = "false",
  isBeta = false,
  ...props
}: TProps) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div {...props}>
      <div className={`flex justify-between cursor-pointer group`} onClick={() => setIsOpen(!isOpen)} data-cy="accordian-control">
        <div className="flex items-center gap-2">
          <Heading>{title}</Heading>
          {isBeta && <Label>Beta</Label>}
        </div>
        <span className={`text-textDark opacity-40 group-hover:opacity-100 ${isOpen ? "" : ""}`}>
          {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              collapsed: { opacity: 0, height: 0, marginTop: 0 },
              open: { opacity: 1, height: "auto", marginTop: "20px" },
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
