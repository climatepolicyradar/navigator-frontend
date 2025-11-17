import { Section } from "@/components/molecules/section/Section";
import { ViewMore, TProps as TViewMoreProps } from "@/components/molecules/viewMore/ViewMore";
import { TBlock } from "@/types";

type TProps = TViewMoreProps & {
  block: TBlock;
  title: string;
  wide?: boolean;
};

export const TextBlock = ({ block, title, wide, ...viewMoreProps }: TProps) => (
  <Section block={block} title={title} wide={wide}>
    <div className="col-start-1 -col-end-1">
      <ViewMore {...viewMoreProps} />
    </div>
  </Section>
);
