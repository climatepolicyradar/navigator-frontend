type TProps = {
  children: React.ReactNode;
};

export const InputListContainer = ({ children }: TProps) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};
