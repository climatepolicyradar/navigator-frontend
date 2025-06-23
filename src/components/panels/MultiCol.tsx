interface IProps {
  extraClasses?: string;
  children?: React.ReactNode;
}

export function MultiCol({ extraClasses = "", children, ...props }: IProps & React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={`max-w-maxSiteWidth mx-auto flex items-stretch ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
