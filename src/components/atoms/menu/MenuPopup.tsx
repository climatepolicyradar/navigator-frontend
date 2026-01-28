import { Menu as BaseMenu } from "@base-ui/react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends BaseMenu.Popup.Props {
  className?: string;
}

export const MenuPopup = ({ className, ...props }: IProps) => {
  const allClasses = joinTailwindClasses(
    "min-w-37.5 p-1 bg-surface-light border border-border-light rounded-lg shadow-xs focus-visible:outline-none",
    className
  );

  return <BaseMenu.Popup className={allClasses} {...props} />;
};
