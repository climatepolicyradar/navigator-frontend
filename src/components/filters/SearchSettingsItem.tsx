type TProps = {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export const SearchSettingsItem = ({ children, isActive, onClick, ...props }: TProps) => (
  <a className={`text-white hover:text-white hover:opacity-100 ${isActive ? "" : "opacity-70"}`} onClick={onClick} href="#" {...props}>
    {children}
  </a>
);
