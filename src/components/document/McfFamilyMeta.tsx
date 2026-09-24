import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { Geographies } from "@/components/molecules/geographies/Geographies";
import { mapFamilyMetadata } from "@/helpers/mapFamilyMetadata";
import { TFamilyMetadata, TFamilyPublic, TMCFFamilyMetadata } from "@/types";

interface MetadataItemProps {
  label: string;
  values: string | string[];
}

type TFamilyMetadataUnion = TFamilyMetadata | TMCFFamilyMetadata;

interface McfFamilyMetaProps {
  family: TFamilyPublic;
  metadata: TFamilyMetadataUnion;
}

interface MultipleValuesContentProps {
  label: string;
  values: string[];
}

const MultipleValuesContentComponent = ({ label, values }: MultipleValuesContentProps) => {
  return (
    <>
      <div className="flex row items-center">
        <span className="text-sm font-bold px-1">
          <strong>{label}</strong>
        </span>
      </div>
      {values.map((item, index) => (
        <div key={item} className="flex items-center">
          <span key={item} className="text-sm">
            {item}
          </span>
          {index !== values.length - 1 && <span>,</span>}
        </div>
      ))}
    </>
  );
};

const MetadataItem = ({ label, values }: MetadataItemProps) => {
  const isUrl = label === "Source";

  const getValueContent = () => {
    if (isUrl && typeof values === "string") {
      return (
        <PageLink
          external
          href={values}
          className="pl-1 text-sm text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand"
        >
          Visit project page
        </PageLink>
      );
    } else {
      return <span className="pl-1 text-sm">{values}</span>;
    }
  };

  if (Array.isArray(values)) {
    return <MultipleValuesContentComponent values={values} label={label} />;
  }

  return (
    <div className="flex items-center row">
      <div className="pl-1">
        <span className="text-sm font-bold">
          <strong>{label}</strong>
        </span>
        {getValueContent()}
      </div>
    </div>
  );
};

export const McfFamilyMeta = ({ family, metadata }: McfFamilyMetaProps) => {
  const mappedMetadata = mapFamilyMetadata(metadata);

  return (
    <div className="w-full bg-white py-4 flex flex-col gap-2">
      {mappedMetadata.map((item, index) => (
        <div className="flex flex-wrap gap-1" key={item.label}>
          {item.label === "Geography" ? (
            <div className="flex items-center row pl-1 text-sm">
              <strong>Geographies</strong>
              <Geographies geographyLabels={family.geographies} className="pl-1" />
            </div>
          ) : (
            <MetadataItem key={index} label={item.label} values={item.value} />
          )}
        </div>
      ))}
    </div>
  );
};
