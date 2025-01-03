type TProps = {
  children: React.ReactNode;
};

export const Heading = ({ children }: TProps) => {
  return <div className="text-[15px] font-medium text-textDark">{children}</div>;
};
