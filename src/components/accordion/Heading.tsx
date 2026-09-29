interface IProps {
  children: React.ReactNode;
}

export const Heading = ({ children }: IProps) => {
  return <h3 className="text-[15px] font-medium text-text-emphasis text-left">{children}</h3>;
};
