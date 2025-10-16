interface IProps {
  children: React.ReactNode;
}

export const Heading = ({ children }: IProps) => {
  return <div className="text-base font-medium text-textDark">{children}</div>;
};
