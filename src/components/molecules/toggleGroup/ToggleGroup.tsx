import { ToggleGroup as BaseToggleGroup } from "@base-ui-components/react/toggle-group";
import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends BaseToggleGroup.Props {
  children: ReactNode;
  className?: string;
}

export const ToggleGroup = ({ children, className, ...props }: IProps) => {
  const allClasses = joinTailwindClasses("inline-flex gap-1", className);

  return (
    <BaseToggleGroup className={allClasses} {...props}>
      {children}
    </BaseToggleGroup>
  );
};
