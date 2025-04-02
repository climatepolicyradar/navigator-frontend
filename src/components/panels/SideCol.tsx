type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export function SideCol({ extraClasses = "", children, ...props }: TProps) {
  return (
    <div className={`md:block md:w-maxSidebar md:grow-0 md:shrink-0 ${extraClasses}`} {...props}>
      {children}
    </div>
  );
}
