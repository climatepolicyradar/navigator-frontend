import { Section } from "@/components/molecules/section/Section";
import { IMetadata } from "@/types";

interface IProps {
  metadata: IMetadata[];
}

export const MetadataBlock = ({ metadata }: IProps) => {
  return (
    <Section title="About this case" id="metadata-block">
      <div className="rounded border border-border-light p-12">
        <div className="grid gap-3">
          {metadata.length === 0 && <div className="text-text-secondary">Sorry, there is no data available at this time.</div>}
          {metadata.map((item, index) => (
            <div key={index} className="grid md:gap-3 md:grid-cols-(--metadata-grid)">
              <div className="text-text-primary font-semibold">{item.label}</div>
              <div>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
