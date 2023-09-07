import { ToolTipSSR } from "./TooltipSSR";

interface TooltipProps {
  id: string;
  tooltip: string | React.ReactNode;
  icon?: "?" | "!" | "i";
  place?: "top" | "right" | "bottom" | "left";
  colour?: string;
  interactableContent?: boolean;
}

const Tooltip = ({ id, tooltip, icon = "?", colour = "blue-600", place, interactableContent }: TooltipProps) => {
  return (
    <div>
      <button
        data-tip={tooltip}
        data-for={id}
        className={`circle-sm rounded-full border border-${colour} bg-white text-${colour} flex justify-center items-center text-xs`}
      >
        {icon}
      </button>
      <ToolTipSSR id={id} place={place} tooltip={tooltip} interactableContent={interactableContent} />
    </div>
  );
};
export default Tooltip;
