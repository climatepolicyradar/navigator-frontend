type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export function MultiCol({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`flex ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
