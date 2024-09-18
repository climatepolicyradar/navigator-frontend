type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export function FullWidth({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`px-5 ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
