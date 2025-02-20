import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

type TProps = {
  id: string;
  place?: "top" | "right" | "bottom" | "left";
  tooltip?: string | React.ReactNode;
  interactableContent?: boolean;
};

export const ToolTipSSR = ({ id, place, tooltip, interactableContent }: TProps) => {
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
