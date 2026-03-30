import { Check } from "lucide-react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  children: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SearchSettingsItem = ({ children, isActive, isDisabled, onClick, ...props }: IProps) => {
  const allClasses = joinTailwindClasses(
    "text-left flex basis-full justify-between gap-1 text-text-primary items-top",
    isDisabled ? "!cursor-not-allowed" : "hover:opacity-100",
    !isActive && "opacity-80"
  );

  return (
    <li className="flex">
      <button className={allClasses} disabled={isDisabled} onClick={onClick} {...props}>
        {children}
        {isActive && <Check size="14" className="shrink-0 mt-1" />}
      </button>
    </li>
  );
};
