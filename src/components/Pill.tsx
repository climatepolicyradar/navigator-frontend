import { Icon } from "@/components/atoms/icon/Icon";
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
        className={`bg-inputSelected/[.07] text-xs font-medium py-1 px-3 text-inputSelected rounded-full flex gap-2 text-left items-center transition hover:bg-inputSelected/[.1] active:bg-inputSelected/[.2] ${extraClasses}`}
        onClick={handleClick}
        data-tooltip-id="tooltip"
        data-tooltip-content="Remove filter"
      >
        {children}{" "}
        <span className="">
          <Icon name="close" width="8" height="8" />
        </span>
      </button>
      <ToolTipSSR id="tooltip" tooltip="Remove filter" />
    </>
  );
};
export default Pill;
