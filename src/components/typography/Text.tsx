interface IProps {
  children: React.ReactNode;
}

export const Text = ({ children }: IProps) => {
  return <p>{children}</p>;
};
