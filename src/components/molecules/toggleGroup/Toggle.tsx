import { Toggle as BaseToggle } from "@base-ui-components/react/toggle";
import { LucideIcon } from "lucide-react";

interface IProps extends BaseToggle.Props {
  children?: never;
  Icon: LucideIcon;
  text: string;
}

export const Toggle = ({ Icon, text, ...props }: IProps) => (
  <BaseToggle
    className="flex gap-1 items-center px-3 py-2 rounded-full text-sm text-text-tertiary font-semibold leading-none hover:bg-surface-ui data-[pressed]:bg-surface-ui data-[pressed]:text-text-primary"
    {...props}
  >
    <Icon size={16} className="text-text-tertiary" />
    {text}
  </BaseToggle>
);
