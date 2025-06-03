interface IProps {
  extraClasses?: string;
}

export function SideCol({ extraClasses = "", children, ...props }: IProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`md:block md:w-maxSidebar md:grow-0 md:shrink-0 ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
