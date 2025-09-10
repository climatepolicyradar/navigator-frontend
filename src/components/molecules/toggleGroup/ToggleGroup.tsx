import { ToggleGroup as BaseToggleGroup } from "@base-ui-components/react/toggle-group";
import { ReactNode } from "react";

interface IProps extends BaseToggleGroup.Props {
  children: ReactNode;
  className?: string;
}

export const ToggleGroup = ({ children, className, ...props }: IProps) => (
  <BaseToggleGroup className="inline-flex h-10 p-1 bg-surface-ui rounded-full" {...props}>
    {children}
  </BaseToggleGroup>
);
