import { ReactNode } from "react";

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
      <div className="col-start-1 -col-end-1 border border-border-light rounded p-4 md:p-8 lg:p-12">
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
