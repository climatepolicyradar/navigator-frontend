import { Button } from "@/components/atoms/button/Button";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ITutorialButton, TTutorialButtonAction, TTutorialName } from "@/types";

interface IProps extends ITutorialButton {
  actions: Record<TTutorialButtonAction, () => void>;
  className?: string;
}

export const TutorialButton = ({ action, actions, className = "", color = "brand", pageLink, text, variant }: IProps) => {
  const button = (
    <Button
      size="small"
      color={color}
      variant={variant}
      onClick={action ? actions[action] : undefined}
      className={className}
      data-ph-capture-attribute-button-purpose={"tutorial-" + action}
    >
      {text}
    </Button>
  );

  return pageLink ? <PageLink {...pageLink}>{button}</PageLink> : button;
};
