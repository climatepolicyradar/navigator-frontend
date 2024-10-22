import { getIcon } from "@helpers/getMetadataIcon";
import { mapFamilyMetadata } from "@helpers/mapFamilyMetadata";
import { ExternalLink } from "@components/ExternalLink";

const MetadataItem = ({ label, icon, value }) => {
  const isUrl = label === "Source";
  const IconComponent = getIcon(icon);

  return (
    <div className="flex items-center gap-1 pt-1 pr-1 pb-1">
      <IconComponent className="w-[16px] h-[16px]" />
      <div className="flex flex-row gap-1">
        <span className="text-xs font-bold">
          <strong>{label}</strong>
        </span>
        {isUrl ? (
          <ExternalLink url={value} className="text-blue-600 underline truncate text-xs">
            {" "}
            Visit project page
          </ExternalLink>
        ) : (
          <span className=" text-xs">{value}</span>
        )}
      </div>
    </div>
  );
};

export const McfFamilyMeta = ({ metadata }) => {
  const mappedMetadata = mapFamilyMetadata(metadata);

  return (
    <div className="w-full bg-white py-4">
      <div className="flex flex-wrap">
        {mappedMetadata.map((item, index) => (
          <MetadataItem key={index} label={item.label} icon={item.iconLabel} value={item.value} />
        ))}
      </div>
    </div>
  );
};
