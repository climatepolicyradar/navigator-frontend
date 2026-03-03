import { Button } from "@/components/atoms/button/Button";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ITutorialButton, TTutorialButtonAction, TTutorialName } from "@/types";

interface IProps extends ITutorialButton {
  name: TTutorialName;
  use: "banner" | "card" | "modal";
  actions: Record<TTutorialButtonAction, () => void>;
  className?: string;
}

export const TutorialButton = ({ action, actions, className = "", color = "brand", name, pageLink, text, use, variant }: IProps) => {
  const button = (
    <Button
      size="small"
      color={color}
      variant={variant}
      onClick={action ? actions[action] : undefined}
      className={className}
      data-ph-capture-attribute-tutorial-name={name}
      data-ph-capture-attribute-tutorial-component={use}
      data-ph-capture-attribute-button-purpose={"tutorial-" + action}
      data-ph-capture-attribute-button-link={pageLink ? true : undefined}
      {...(action === "dismiss" ? { title: `Dismiss ${use}` } : {})}
    >
      {text}
    </Button>
  );

  return pageLink ? <PageLink {...pageLink}>{button}</PageLink> : button;
};
