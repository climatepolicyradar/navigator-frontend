import { SiteWidth } from "@/components/panels/SiteWidth";

interface IProps {
  extraClasses?: string;
  children?: React.ReactNode;
}

export const SubNav = ({ extraClasses = "", children, ...props }: IProps) => {
  return (
    <div className={`border-b border-gray-200 py-4 ${extraClasses}`} {...props}>
      <SiteWidth extraClasses="md:flex justify-between items-center">{children}</SiteWidth>
    </div>
  );
};
