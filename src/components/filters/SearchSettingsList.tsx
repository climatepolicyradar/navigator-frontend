interface IProps {
  children: React.ReactNode;
}

export const SearchSettingsList = ({ children, ...props }: IProps) => (
  <ul className="flex flex-col gap-2" {...props}>
    {children}
  </ul>
);
