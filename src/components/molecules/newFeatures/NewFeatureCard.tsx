import { X } from "lucide-react";
import { useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { TNewFeatureButtonAction, TNewFeatureCard } from "@/types";

export interface IProps {
  className?: string;
  order: number;
  card: TNewFeatureCard;
}

export const NewFeatureCard = ({ className, order, card: { buttonPrimary, buttonSecondary, close, text, title } }: IProps) => {
  const { previousNewFeature, setDisplayNewFeature, setPreviousNewFeature } = useContext(NewFeatureContext);

  if (previousNewFeature === null || previousNewFeature >= order) return null;

  const buttonActions: Record<TNewFeatureButtonAction, () => void> = {
    dismiss: () => setPreviousNewFeature(order),
    showModal: () => setDisplayNewFeature(order),
  };

  return (
    <Card className={className}>
      {(title || close) && (
        <div className="flex justify-end text-text-light">
          {title && <span className="flex-1 text-sm leading-tight font-semibold">{title}</span>}
          {close && (
            <button type="button" onClick={buttonActions.dismiss}>
              <X size="16" />
            </button>
          )}
        </div>
      )}
      <p className="mt-1.5 mb-3 text-sm text-text-light/85">{text}</p>
      <div className="flex gap-2">
        <Button
          size="small"
          variant="outlined"
          className="border-border-light/75 hover:border-border-light hover:!bg-transparent text-text-light"
          onClick={buttonActions[buttonPrimary.action]}
        >
          {buttonPrimary.text}
        </Button>
        {buttonSecondary && (
          <Button
            size="small"
            variant="ghost"
            className="text-text-light/75 hover:text-text-light hover:!bg-transparent"
            onClick={buttonActions[buttonSecondary.action]}
          >
            {buttonSecondary.text}
          </Button>
        )}
      </div>
    </Card>
  );
};
