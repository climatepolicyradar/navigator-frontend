import { Toggle as BaseToggle } from "@base-ui-components/react";
import { LucideIcon } from "lucide-react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends BaseToggle.Props {
  children?: string;
  className?: string;
  Icon?: LucideIcon;
  rounded?: boolean;
}

export const Toggle = ({ className, children, Icon, rounded = false, title, ...props }: IProps) => {
  const allClasses = joinTailwindClasses(
    "px-3 py-2 flex items-center gap-1 text-sm text-text-tertiary leading-none font-semibold rounded-full [&[data-pressed]]:bg-surface-ui [&[data-pressed]]:text-text-primary",
    rounded ? "rounded-full" : "rounded-md",
    className
  );

  return (
    <BaseToggle className={allClasses} {...props}>
      {Icon && <Icon size={16} className="text-text-tertiary" />}
      {children}
    </BaseToggle>
  );
};
