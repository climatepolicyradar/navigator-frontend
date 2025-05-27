interface IProps {
  children: React.ReactNode;
}

export const Quote = ({ children }: IProps) => {
  return (
    <div className="pl-4 border-l-2 border-blue-600">
      <p className="text-sm text-neutral-600">{children}</p>
    </div>
  );
};
