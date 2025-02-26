import { allIcons, IconName, IconProps } from "@components/svg/Icons";

interface IconComponentProps extends IconProps {
  name: IconName;
}

export const Icon = ({ name, ...iconProps }: IconComponentProps) => allIcons[name](iconProps);
