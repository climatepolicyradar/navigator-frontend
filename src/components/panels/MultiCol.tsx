type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export function MultiCol({ extraClasses = "", children, ...props }: TProps & React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={`max-w-maxSiteWidth mx-auto flex items-stretch ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
