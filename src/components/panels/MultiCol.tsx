type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export function MultiCol({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`max-w-maxSiteWidth mx-auto flex items-stretch ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
