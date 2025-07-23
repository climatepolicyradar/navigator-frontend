import { ReactNode, useEffect, useRef, useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  children: ReactNode;
  maxHeight?: number;
}

export const TextBlock = ({ children, maxHeight = 150 }: IProps) => {
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
  const containerClasses = joinTailwindClasses("relative", isOpen ? "overflow-visible" : "overflow-hidden");

  return (
    <Section id="section-summary" title="Summary">
      <div className="relative">
        <div className={containerClasses} style={{ maxHeight: isOpen ? undefined : maxHeight }}>
          {/* DOM element to measure height of */}
          <div ref={contentRef}>{children}</div>
        </div>
        {contentIsOverflowing && (
          <div className="pt-4">
            <button type="button" onClick={onToggle} className="text-sm text-text-tertiary hover:underline">
              {isOpen ? "+ View less" : "+ View more"}
            </button>
          </div>
        )}
      </div>
    </Section>
  );
};
