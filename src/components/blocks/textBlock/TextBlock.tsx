import { Section } from "@/components/molecules/section/Section";
import { ViewMore, TProps as TViewMoreProps } from "@/components/molecules/viewMore/ViewMore";

type TProps = TViewMoreProps & {
  id: string;
  title: string;
  wide?: boolean;
};

export const TextBlock = ({ id, title, wide, ...viewMoreProps }: TProps) => (
  <Section id={id} title={title} wide={wide}>
    <ViewMore {...viewMoreProps} />
  </Section>
);
