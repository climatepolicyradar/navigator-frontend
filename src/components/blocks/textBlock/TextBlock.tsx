import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { TProps as TSectionProps } from "@/components/molecules/section/Section";
import { Section } from "@/components/molecules/section/Section";
import { joinTailwindClasses } from "@/utils/tailwind";

type TProps = TSectionProps & {
  maxHeight?: number;
};

export const TextBlock = ({ children, maxHeight = 150, ...sectionProps }: TProps) => {
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
    <Section {...sectionProps}>
      <div className="relative">
        <div className={containerClasses} style={{ maxHeight: isOpen ? undefined : maxHeight }}>
          {/* DOM element to measure height of */}
          <div ref={contentRef}>{children}</div>
        </div>
        {contentIsOverflowing && (
          <div className="pt-4">
            <Button color="mono" size="small" rounded variant="faded" onClick={onToggle}>
              {isOpen ? "View less" : "View more"}
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
};
