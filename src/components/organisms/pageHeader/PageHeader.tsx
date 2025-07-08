import { Columns } from "@/components/atoms/columns/Columns";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  coloured?: boolean;
  label: string;
  title: string;
}

export const PageHeader = ({ coloured = false, label, title }: IProps) => {
  const containerClasses = joinTailwindClasses("pt-8 pb-24", coloured && "bg-surface-brand-darker");

  const largeTextClasses = "text-[32px] leading-none font-bold";
  const labelClasses = joinTailwindClasses(largeTextClasses, coloured ? "text-text-light/60" : "text-text-tertiary");
  const titleClasses = joinTailwindClasses(
    largeTextClasses,
    "block cols-3:w-[80%] cols-3:col-span-2 cols-4:col-span-3",
    coloured ? "text-text-light" : "text-text-primary"
  );

  return (
    <Columns containerClasses={containerClasses}>
      <div className={labelClasses}>{label}</div>
      <h1 className={titleClasses}>{title}</h1>
    </Columns>
  );
};

<div className="text-text" />;
