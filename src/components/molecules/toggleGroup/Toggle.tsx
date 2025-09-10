import { Toggle as BaseToggle } from "@base-ui-components/react/toggle";

interface IProps extends BaseToggle.Props {
  children: string;
}

export const Toggle = ({ children, ...props }: IProps) => (
  <BaseToggle
    className="h-8 px-4 rounded-full text-[15px] text-text-secondary font-semibold leading-none data-[pressed]:bg-surface-light data-[pressed]:text-text-primary"
    {...props}
  >
    {children}
  </BaseToggle>
);
