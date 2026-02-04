import { Check } from "lucide-react";

interface IProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SearchSettingsItem = ({ children, isActive, onClick, ...props }: IProps) => (
  <li className="flex">
    <button
      className={`text-left flex basis-full justify-between gap-1 text-text-primary items-top hover:opacity-100 ${isActive ? "" : "opacity-80"}`}
      onClick={onClick}
      {...props}
    >
      {children}
      {isActive && <Check size="14" className="shrink-0 mt-1" />}
    </button>
  </li>
);
