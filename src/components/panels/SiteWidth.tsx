type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
  [x: string]: any;
};

export function SiteWidth({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`max-w-maxSiteWidth px-5 mx-auto ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
