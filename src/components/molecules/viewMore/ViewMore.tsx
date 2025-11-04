import { ReactNode, useEffect, useRef, useState } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IViewMoreGenericProps {
  buttonText?: [string, string];
  onButtonClick?: () => void;
}

// Plain text - displays a maximum number of lines
interface IViewMoreTextProps extends IViewMoreGenericProps {
  children: string;
  maxLines: number;
  maxHeight?: never;
}

// HTML markup - displays a maximum height of the child element. Heavily discouraged
interface IViewMoreContentProps extends IViewMoreGenericProps {
  children: ReactNode;
  maxHeight?: number;
  maxLines?: never;
}

export type TProps = IViewMoreTextProps | IViewMoreContentProps;

export const ViewMore = ({ children, buttonText = ["View more", "View less"], onButtonClick, maxLines, maxHeight = 150 }: TProps) => {
  const contentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const isText = typeof maxLines === "number";

  // Calculate if the content is overflowing, including each time the window width changes
  useEffect(() => {
    const calculateIsOverflowing = () => setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight);

    calculateIsOverflowing();
    window.addEventListener("resize", calculateIsOverflowing);

    return () => {
      window.removeEventListener("resize", calculateIsOverflowing);
    };
  }, [contentRef, children, maxLines, maxHeight]);

  const onViewMore = () => {
    onButtonClick ? onButtonClick() : setIsOpen((isOpenCurrent) => !isOpenCurrent);
  };

  const contentClasses = joinTailwindClasses(!isOpen && "overflow-hidden", !isOpen && isText && "line-clamp-4");
  const contentStyles = {
    WebkitLineClamp: !isOpen && isText ? maxLines : undefined,
    maxHeight: !isOpen && !isText ? maxHeight : undefined,
  };

  return (
    <div>
      <div ref={contentRef} className={contentClasses} style={contentStyles}>
        {children}
      </div>
      {isOverflowing && (
        <button
          type="button"
          onClick={onViewMore}
          className="p-2 mt-3 hover:bg-gray-50 active:bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 leading-4 font-medium"
        >
          {isOpen ? buttonText[1] : buttonText[0]}
        </button>
      )}
    </div>
  );
};
