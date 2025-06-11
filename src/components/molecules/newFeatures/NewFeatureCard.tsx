import { useContext } from "react";
import { LuX } from "react-icons/lu";

import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { INewFeature } from "@/constants/newFeatures";
import { NewFeatureContext } from "@/context/NewFeatureContext";

interface IProps {
  className?: string;
  newFeature: INewFeature;
}

export const NewFeatureCard = ({ className, newFeature: { cardText, order } }: IProps) => {
  const { previousNewFeature, setDisplayNewFeature, setPreviousNewFeature } = useContext(NewFeatureContext);

  if (previousNewFeature === null || previousNewFeature >= order) return null;

  const onDismiss = () => setPreviousNewFeature(order);

  return (
    <Card className={className}>
      <div className="flex justify-between text-text-light">
        <span className="text-sm leading-tight font-semibold">New improvement</span>
        <button type="button" onClick={onDismiss}>
          <LuX size="16" />
        </button>
      </div>
      <p className="mt-1.5 mb-3 text-sm text-text-light/85">{cardText}</p>
      <div className="flex gap-2">
        <Button
          size="small"
          variant="outlined"
          className="border-border-light/75 hover:border-border-light hover:!bg-transparent text-text-light"
          onClick={() => setDisplayNewFeature(order)}
        >
          Learn more
        </Button>
        <Button size="small" variant="ghost" className="text-text-light/75 hover:text-text-light hover:!bg-transparent" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </Card>
  );
};
