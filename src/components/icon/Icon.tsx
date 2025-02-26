import { allIcons, IconName, IconProps } from "@components/svg/Icons";

interface IconComponentProps extends IconProps {
  name: IconName;
}

/**
 * Renders an SVG icon from our internal icons library. All icons are SVG markup as JSX, allowing us to set currentColor to colour them.
 */
export const Icon = ({ name, ...iconProps }: IconComponentProps) => allIcons[name](iconProps);
