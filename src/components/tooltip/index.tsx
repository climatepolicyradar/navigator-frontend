import { ToolTipSSR } from "./TooltipSSR";

interface TooltipProps {
  id: string;
  tooltip: string | React.ReactNode;
  icon?: "?" | "!" | "i";
  place?: "top" | "right" | "bottom" | "left";
  interactableContent?: boolean;
}

const Tooltip = ({ id, tooltip, icon = "?", place, interactableContent }: TooltipProps) => {
  return (
    <div className="">
      <button
        data-tooltip-id={id}
        className={`circle-sm rounded-full border border-blue-600 bg-white text-blue-600 flex justify-center items-center text-xs`}
      >
        {icon}
      </button>
      <ToolTipSSR id={id} place={place} tooltip={tooltip} interactableContent={interactableContent} />
    </div>
  );
};
export default Tooltip;
