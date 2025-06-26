import { Toggle as BaseToggle } from "@base-ui-components/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends BaseToggle.Props {
  children?: ReactNode;
  className?: string;
  Icon?: LucideIcon;
}

export const Toggle = ({ className, children, Icon, title, ...props }: IProps) => {
  const allClasses = joinTailwindClasses(
    "px-3 py-2 flex items-center gap-1 text-sm text-text-tertiary leading-none font-semibold rounded-full [&[data-pressed]]:bg-surface-ui [&[data-pressed]]:text-text-primary",
    className
  );

  return (
    <BaseToggle className={allClasses} {...props}>
      {Icon && <Icon size={16} className="text-text-tertiary" />}
      {children}
    </BaseToggle>
  );
};
