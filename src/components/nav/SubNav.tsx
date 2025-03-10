import { SiteWidth } from "@/components/panels/SiteWidth";

type TProps = {
  extraClasses?: string;
  children?: React.ReactNode;
};

export const SubNav = ({ extraClasses = "", children, ...props }: TProps) => {
  return (
    <div className={`border-b border-grey-200 py-4 ${extraClasses}`} {...props}>
      <SiteWidth extraClasses="md:flex justify-between items-center">{children}</SiteWidth>
    </div>
  );
};
