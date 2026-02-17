import { Button } from "@/components/atoms/button/Button";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ITutorialButton, TTutorialButtonAction } from "@/types";

interface IProps extends ITutorialButton {
  actions: Record<TTutorialButtonAction, () => void>;
  className?: string;
  use: "banner" | "card" | "modal";
}

export const TutorialButton = ({ action, actions, className = "", color = "brand", pageLink, text, use, variant }: IProps) => {
  const button = (
    <Button
      size="small"
      color={color}
      variant={variant}
      onClick={action ? actions[action] : undefined}
      className={className}
      data-ph-capture-attribute-button-purpose={"tutorial-" + action}
      {...(action === "dismiss" ? { title: `Dismiss ${use}` } : {})}
    >
      {text}
    </Button>
  );

  return pageLink ? <PageLink {...pageLink}>{button}</PageLink> : button;
};
