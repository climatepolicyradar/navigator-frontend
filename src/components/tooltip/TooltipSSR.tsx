import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

interface IProps {
  id: string;
  place?: "top" | "right" | "bottom" | "left";
  tooltip?: string | React.ReactNode;
  interactableContent?: boolean;
}

export const ToolTipSSR = ({ id, place, tooltip, interactableContent }: IProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <Tooltip className="customTooltip" id={id} place={place} delayHide={interactableContent ? 1000 : 0}>
          {tooltip}
        </Tooltip>
      )}
    </>
  );
};
