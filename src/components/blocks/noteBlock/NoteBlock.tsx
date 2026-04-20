import { Section } from "@/components/molecules/section/Section";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { TFamilyAttribution } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  attribution: TFamilyAttribution;
}

export const NoteBlock = ({ attribution: { corpusImage, corpusImageAlt, corpusNote } }: IProps) => {
  if (!corpusNote) return null;

  const viewMoreClasses = joinTailwindClasses("col-start-1 -col-end-1", corpusImage && "cols-3:col-start-3");

  return (
    <Section block="note" title="Note">
      <div className="grid grid-cols-subgrid gap-y-6 col-start-1 -col-end-1">
        {corpusImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="col-span-2 max-w-40 mt-2" src={`${corpusImage}`} alt={corpusImageAlt} />
          </>
        )}
        <ViewMore context="note-block" containerClasses={viewMoreClasses}>
          <div className="text-content" dangerouslySetInnerHTML={{ __html: corpusNote }}></div>
        </ViewMore>
      </div>
    </Section>
  );
};
