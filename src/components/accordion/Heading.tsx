interface IProps {
  children: React.ReactNode;
}

export const Heading = ({ children }: IProps) => {
  return <h3 className="text-[15px] font-medium text-textDark">{children}</h3>;
};
