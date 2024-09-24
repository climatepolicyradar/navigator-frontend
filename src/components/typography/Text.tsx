type TProps = {
  children: React.ReactNode;
};

export const Text = ({ children }: TProps) => {
  return <p>{children}</p>;
};
