import { X } from "lucide-react";

import { ToolTipSSR } from "@/components/tooltip/TooltipSSR";

interface IProps {
  onClick?: () => void;
  children: React.ReactNode;
  extraClasses?: string;
}

/**
 * A pill with a remove button. Represents a search query parameter.
 */
const Pill = ({ children, onClick, extraClasses = "" }: IProps) => {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <button
        className={`text-xs font-medium py-1 px-3 text-inputSelected rounded-full flex gap-1 text-left items-center transition bg-inputSelected/[.07] hover:bg-inputSelected/10 active:bg-inputSelected/20 ${extraClasses}`}
        onClick={handleClick}
        data-tooltip-id="tooltip"
        data-tooltip-content="Remove filter"
      >
        {children} <X height="12" width="12" />
      </button>
      <ToolTipSSR id="tooltip" tooltip="Remove filter" />
    </>
  );
};
export default Pill;
