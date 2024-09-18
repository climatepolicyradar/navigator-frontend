type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export function SideCol({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`width-maxSidebar grow-0 shrink-0 ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
