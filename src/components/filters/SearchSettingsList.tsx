interface IProps {
  children: React.ReactNode;
}

export const SearchSettingsList = ({ children, ...props }: IProps) => (
  <div className="flex flex-col gap-2" {...props}>
    {children}
  </div>
);
