import { LuCheck } from "react-icons/lu";

interface IProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const SearchSettingsItem = ({ children, isActive, onClick, ...props }: IProps) => (
  <a
    className={`flex gap-1 text-white items-center hover:text-white hover:opacity-100 ${isActive ? "" : "opacity-70"}`}
    onClick={onClick}
    href="#"
    {...props}
  >
    {isActive && <LuCheck size="14" />}
    {children}
  </a>
);
