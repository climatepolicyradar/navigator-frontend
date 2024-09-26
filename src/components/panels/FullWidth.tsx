type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
  [x: string]: any;
};

export function FullWidth({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`px-5 ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
