interface IProps {
  extraClasses?: string;
  children?: React.ReactNode;
}

export function SingleCol({ extraClasses = "", children, ...props }: IProps) {
  return (
    <div className={`max-w-maxContent basis-maxContent mx-auto ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
