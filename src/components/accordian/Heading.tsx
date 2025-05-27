interface IProps {
  children: React.ReactNode;
}

export const Heading = ({ children }: IProps) => {
  return <div className="text-[15px] font-medium text-textDark">{children}</div>;
};
