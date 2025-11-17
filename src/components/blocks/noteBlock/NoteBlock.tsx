import { Section } from "@/components/molecules/section/Section";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { getCorpusInfo } from "@/helpers/getCorpusInfo";
import { TCorpusTypeDictionary } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  corpusId: string;
  corpusTypes: TCorpusTypeDictionary;
}

export const NoteBlock = ({ corpusId, corpusTypes }: IProps) => {
  const { corpusNote, corpusImage, corpusAltImage } = getCorpusInfo({ corpus_id: corpusId, corpus_types: corpusTypes });

  if (!corpusNote) return null;

  const viewMoreClasses = joinTailwindClasses("col-start-1 -col-end-1", corpusImage && "cols-3:col-start-3");

  return (
    <Section id="note" title="Note">
      <div className="grid grid-cols-subgrid gap-y-6 col-start-1 -col-end-1">
        {corpusImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="col-span-2 max-w-40 mt-2" src={`${corpusImage}`} alt={corpusAltImage} />
          </>
        )}
        <ViewMore containerClasses={viewMoreClasses}>
          <div className="text-content" dangerouslySetInnerHTML={{ __html: corpusNote }}></div>
        </ViewMore>
      </div>
    </Section>
  );
};
