type TProps = {
  extraClasses?: string;
};

export function SideCol({ extraClasses = "", children, ...props }: TProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`w-maxSidebar grow-0 shrink-0 ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
