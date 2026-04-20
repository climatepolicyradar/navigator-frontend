import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  usesDataIn: boolean;
}

export const DataInDebug = ({ usesDataIn }: IProps) => {
  const spanClasses = "px-1 py-0.5 text-black";
  const booleanClasses = (value: boolean) => (value ? "bg-green-200" : "bg-red-200");
  const dataInClasses = joinTailwindClasses(spanClasses, booleanClasses(usesDataIn));

  return (
    <FiveColumns>
      <div className="col-start-1 -col-end-1 flex flex-row gap-2">
        <span className={dataInClasses}>Uses data-in: {usesDataIn ? "true" : "false"}</span>
      </div>
    </FiveColumns>
  );
};
