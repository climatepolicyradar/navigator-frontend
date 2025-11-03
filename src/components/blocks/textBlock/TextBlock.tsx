import { Section } from "@/components/molecules/section/Section";
import { ViewMore, TProps as TViewMoreProps } from "@/components/molecules/viewMore/ViewMore";

type TProps = TViewMoreProps & {
  block: string;
  title: string;
  wide?: boolean;
};

export const TextBlock = ({ block, title, wide, ...viewMoreProps }: TProps) => (
  <Section id={block} title={title} wide={wide}>
    <ViewMore {...viewMoreProps} />
  </Section>
);
