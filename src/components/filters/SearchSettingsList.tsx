type TProps = {
  children: React.ReactNode;
};

export const SearchSettingsList = ({ children, ...props }: TProps) => (
  <div className="flex flex-col gap-2" {...props}>
    {children}
  </div>
);
