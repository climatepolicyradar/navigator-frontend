import { ToggleGroup as BaseToggleGroup } from "@base-ui-components/react/toggle-group";
import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends BaseToggleGroup.Props {
  bordered?: boolean;
  children: ReactNode;
  className?: string;
}

export const ToggleGroup = ({ bordered, children, className, ...props }: IProps) => {
  const allClasses = joinTailwindClasses("inline-flex gap-1", bordered && "p-[3px] border border-border-light rounded-full", className);

  return (
    <BaseToggleGroup className={allClasses} {...props}>
      {children}
    </BaseToggleGroup>
  );
};
