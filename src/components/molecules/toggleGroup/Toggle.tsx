import { Toggle as BaseToggle } from "@base-ui-components/react/toggle";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends BaseToggle.Props {
  children: string;
  size?: "medium" | "large";
}

export const Toggle = ({ children, size = "medium", ...props }: IProps) => {
  const allClasses = joinTailwindClasses(
    "rounded-full text-base text-gray-950 font-heavy leading-none data-[pressed]:bg-gray-950 data-[pressed]:text-white",
    size === "medium" ? "px-3 py-2 text-base" : "px-4 py-2.5 text-xl"
  );

  return (
    <BaseToggle className={allClasses} {...props}>
      {children}
    </BaseToggle>
  );
};
