import { X } from "lucide-react";
import { useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorialButtonAction, TTutorialCard, TTutorialName } from "@/types";

export interface IProps {
  className?: string;
  name: TTutorialName;
  card: TTutorialCard;
}

export const TutorialCard = ({ className, name, card: { buttonPrimary, buttonSecondary, close, text, title } }: IProps) => {
  const { addCompletedTutorial, setDisplayTutorial } = useContext(TutorialContext);

  const buttonActions: Record<TTutorialButtonAction, () => void> = {
    dismiss: () => addCompletedTutorial(name),
    showModal: () => setDisplayTutorial(name),
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
          className="border-border-light/75 hover:border-border-light hover:!bg-transparent text-text-light"
          size="small"
          variant={buttonPrimary.variant || "outlined"}
          color={buttonPrimary.color || "brand"}
          onClick={buttonActions[buttonPrimary.action]}
        >
          {buttonPrimary.text}
        </Button>
        {buttonSecondary && (
          <Button
            className="text-text-light/75 hover:text-text-light hover:!bg-transparent"
            size="small"
            variant={buttonSecondary.variant || "ghost"}
            color={buttonSecondary.color || "brand"}
            onClick={buttonActions[buttonSecondary.action]}
          >
            {buttonSecondary.text}
          </Button>
        )}
      </div>
    </Card>
  );
};
