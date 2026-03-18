import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { BFF_TRANSFORMED_CORPORA } from "@/constants/bff";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  corpusId: string;
  usesDataIn?: boolean;
}

export const DataInDebug = ({ corpusId, usesDataIn }: IProps) => {
  const spanClasses = "px-1 py-0.5 text-black";
  const booleanClasses = (value: boolean) => (value ? "bg-green-200" : "bg-red-200");
  const corpusClasses = joinTailwindClasses(spanClasses, booleanClasses(BFF_TRANSFORMED_CORPORA.includes(corpusId)));
  const dataInClasses = joinTailwindClasses(spanClasses, booleanClasses(usesDataIn));

  return (
    <FiveColumns>
      <div className="col-start-1 -col-end-1 flex flex-row gap-2">
        <span className={corpusClasses}>Corpus: {corpusId}</span>
        {usesDataIn !== undefined && <span className={dataInClasses}>Uses data-in: {usesDataIn ? "true" : "false"}</span>}
      </div>
    </FiveColumns>
  );
};
