import { ToolTipSSR } from "./TooltipSSR";

interface IProps {
  id: string;
  tooltip: string | React.ReactNode;
  icon?: "?" | "!" | "i";
  place?: "top" | "right" | "bottom" | "left";
  interactableContent?: boolean;
  colour?: string;
}

const Tooltip = ({ id, tooltip, icon = "?", place, interactableContent, colour }: IProps) => {
  let colourCss = "";
  switch (colour) {
    case "grey":
      colourCss = "text-textNormal border-gray-500";
      break;
    default:
      colourCss = "text-blue-600 border-blue-600";
  }
  return (
    <div>
      <button data-tooltip-id={id} className={`circle-sm rounded-full border bg-white flex justify-center items-center text-xs ${colourCss}`}>
        {icon}
      </button>
      <ToolTipSSR id={id} place={place} tooltip={tooltip} interactableContent={interactableContent} />
    </div>
  );
};
export default Tooltip;
