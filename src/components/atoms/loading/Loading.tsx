import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  className?: string;
  size?: number;
}

export const Loading = ({ className, size = 80 }: IProps) => {
  const containerClasses = joinTailwindClasses("flex items-start justify-center", className);

  return (
    <div className={containerClasses}>
      <object className="radar" type="image/svg+xml" data="/images/radar-loader.svg" width={size} />
    </div>
  );
};
