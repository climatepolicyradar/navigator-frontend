import { CloseIcon } from "./svg/Icons";
import { ToolTipSSR } from "@components/tooltip/TooltipSSR";

type TProps = {
  onClick?: () => void;
  children: React.ReactNode;
};

const Pill = ({ children, onClick }: TProps) => {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <button
        className="bg-inputSelected/[.07] text-xs font-medium py-1 px-3 text-inputSelected rounded-full flex gap-2 items-center transition hover:bg-inputSelected/[.1] active:bg-inputSelected/[.2]"
        onClick={handleClick}
        data-tooltip-id="tooltip"
        data-toltip-content="Remove filter"
      >
        {children}{" "}
        <span className="">
          <CloseIcon width="8" height="8" />
        </span>
      </button>
      <ToolTipSSR id="tooltip" tooltip="Remove filter" />
    </>
  );
};
export default Pill;
