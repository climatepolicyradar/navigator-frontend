import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Heading } from "./Heading";

import { AccordianCloseIcon, AccordianOpenIcon } from "@components/svg/Icons";

type TProps = {
  title: string;
  startOpen?: boolean;
  children: React.ReactNode;
};

export const Accordian = ({ title, startOpen = false, children, ...props }: TProps) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className="" {...props}>
      <div className={`flex justify-between cursor-pointer group`} onClick={() => setIsOpen(!isOpen)}>
        <Heading>{title}</Heading>
        <span className={`opacity-40 group-hover:opacity-100 ${isOpen ? "" : ""}`}>{isOpen ? <AccordianCloseIcon /> : <AccordianOpenIcon />}</span>
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
            <div className="relative max-h-[300px] overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500">
              <>
                {children}
                <span className="h-[34px] sticky block bottom-0 w-full bg-gradient-to-b from-transparent to-white"></span>
              </>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
