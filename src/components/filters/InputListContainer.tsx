interface IProps {
  children: React.ReactNode;
}

export const InputListContainer = ({ children }: IProps) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};
