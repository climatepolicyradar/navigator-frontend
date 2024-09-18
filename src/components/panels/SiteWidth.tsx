type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export function SiteWidth({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`max-w-maxSiteWidth px-global mx-auto ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
