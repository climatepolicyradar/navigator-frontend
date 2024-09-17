type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export function SingleCol({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`max-w-maxContent mx-auto ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
