type TProps = {
  children: React.ReactNode;
  extraClasses?: string;
};

export const Label = ({ children, extraClasses = "" }: TProps) => {
  return (
    <>
      <span className="bg-blue-600 text-white text-xs font-medium px-1.5 py-0.5 rounded-sm">{children}</span>
    </>
  );
};
