import { Menu as BaseMenu } from "@base-ui/react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends BaseMenu.Item.Props {
  className?: string;
  color?: "brand" | "mono";
  heading?: boolean;
}

export const MenuItem = ({ className, color = "mono", disabled, heading = false, ...props }: IProps) => {
  const allClasses = joinTailwindClasses(
    "px-2.5 py-2 rounded-md hover:outline-none focus-visible:outline-none leading-none select-none",
    disabled ? "text-text-tertiary" : "hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] cursor-pointer",
    !disabled && color === "brand" ? "text-[#0038a9]" : "text-text-primary",
    heading ? "text-xs font-semibold" : "text-sm",
    className
  );

  return <BaseMenu.Item className={allClasses} disabled={disabled} {...props} />;
};
