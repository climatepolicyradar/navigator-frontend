import { ReactNode, useEffect, useRef, useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  children: ReactNode;
  containerClasses?: string;
  maxHeight: number;
}

export const ShowMore = ({ children, containerClasses, maxHeight }: IProps) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setContentHeight(contentRef.current.clientHeight);
  }, [setContentHeight]);

  const onToggle = () => {
    setIsOpen((currentIsOpen) => !currentIsOpen);
  };

  const contentIsOverflowing = contentHeight > maxHeight;
  const allContainerClasses = joinTailwindClasses("relative", isOpen ? "overflow-visible" : "overflow-hidden", containerClasses);

  return (
    <div className="relative mb-4">
      <div className={allContainerClasses} style={{ maxHeight: isOpen ? undefined : maxHeight }}>
        <div className={isOpen ? "pb-4" : ""}>
          <div ref={contentRef}>{children}</div>
        </div>
        {contentIsOverflowing && !isOpen && (
          <div
            className="absolute bottom-0 inset-x-0 h-24"
            style={{
              background: "linear-gradient(transparent, white)",
              mask: "linear-gradient(transparent, black, black)",
              backdropFilter: "blur(4px)",
            }}
          />
        )}
      </div>
      {contentIsOverflowing && (
        <div className="absolute -bottom-4 inset-x-0 flex justify-center">
          <Button color="mono" rounded size="small" className="px-3 font-semibold" onClick={onToggle}>
            {isOpen ? "Collapse" : "Show all"}
          </Button>
        </div>
      )}
    </div>
  );
};
