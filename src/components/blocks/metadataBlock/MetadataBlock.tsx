import { Section } from "@/components/molecules/section/Section";
import { IMetadata, TBlock } from "@/types";

interface IProps {
  block: TBlock;
  title?: string;
  metadata: IMetadata[];
}

export const MetadataBlock = ({ block, metadata, title }: IProps) => {
  if (metadata.length === 0) return null;

  return (
    <Section block={block} title={title}>
      <div className="grid grid-cols-subgrid gap-y-3 col-start-1 -col-end-1">
        {metadata.length === 0 && <div className="text-[#6b7280] col-start-1 -col-end-1">Sorry, there is no data available at this time.</div>}
        {metadata.map((item, itemIndex) => (
          <div key={itemIndex} className="grid grid-cols-subgrid col-start-1 -col-end-1">
            <div className="text-[#030712] font-medium col-start-1 -col-end-1 cols-3:col-end-3">{item.label}</div>
            <div className="text-[#374151] -col-end-1 col-start-1 cols-3:col-start-3">{item.value}</div>
          </div>
        ))}
      </div>
    </Section>
  );
};
