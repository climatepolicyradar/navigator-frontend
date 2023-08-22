import { ToolTipSSR } from "./TooltipSSR";

interface TooltipProps {
  id: string;
  tooltip: string | React.ReactNode;
  icon?: "?" | "!" | "i";
  place?: "top" | "right" | "bottom" | "left";
}

const Tooltip = ({ id, tooltip, icon = "?", place }: TooltipProps) => {
  return (
    <div>
      <button data-tip={tooltip} data-for={id} className="circle-sm rounded-full bg-blue-600 text-white flex justify-center items-center text-sm">
        {icon}
      </button>
      <ToolTipSSR id={id} place={place} tooltip={tooltip} />
    </div>
  );
};
export default Tooltip;
