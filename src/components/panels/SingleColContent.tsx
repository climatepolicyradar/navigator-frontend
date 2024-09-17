type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export function SingleColCotent({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`w-maxContent mx-auto ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
