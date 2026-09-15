import { useContext } from "react";

import { FeaturesContext } from "@/context/FeaturesContext";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  className?: string;
}

export const NavBarGradient = ({ className }: IProps) => {
  const features = useContext(FeaturesContext);
  const newSearch = features["new-search"];
  const allClasses = joinTailwindClasses(`sticky top-[128px] cols-4:top-[72px] -z-10 h-0 ${newSearch ? "top-[72px]!" : ""}`, className);

  return (
    <div className={allClasses}>
      <div className="h-30 bg-linear-to-b from-gray-50 to-white" />
    </div>
  );
};
