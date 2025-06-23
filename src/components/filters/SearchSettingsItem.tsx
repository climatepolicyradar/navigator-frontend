import { Check } from "lucide-react";

interface IProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const SearchSettingsItem = ({ children, isActive, onClick, ...props }: IProps) => (
  <a
    className={`flex justify-between gap-1 text-text-primary items-top hover:opacity-100 ${isActive ? "" : "opacity-80"}`}
    onClick={onClick}
    href="#"
    {...props}
  >
    {children}
    {isActive && <Check size="14" className="shrink-0 mt-1" />}
  </a>
);
