import { ExternalLink } from "@components/ExternalLink";
import { CountryLink } from "@components/CountryLink";
import { getIcon } from "@helpers/getMetadataIcon";
import { mapFamilyMetadata } from "@helpers/mapFamilyMetadata";
import { TFamilyMetadata, TMCFFamilyMetadata } from "@types";

import useConfig from "@hooks/useConfig";
import { CountryLinksAsList } from "@components/CountryLinks";

interface MetadataItemProps {
  label: string;
  icon: string;
  value: string | string[];
}

type TFamilyMetadataUnion = TFamilyMetadata | TMCFFamilyMetadata;

interface McfFamilyMetaProps {
  metadata: TFamilyMetadataUnion;
}

const ListOfCountries = ({ countryCodes }) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;
  return <CountryLinksAsList geographies={countryCodes} countries={countries} showFlag={false} />;
};

const MetadataItem = ({ label, icon, value }: MetadataItemProps) => {
  const isUrl = label === "Source";
  const isCountry = label === "Geography";
  const IconComponent = getIcon(icon);

  const getValueContent = () => {
    if (isUrl && typeof value === "string") {
      return (
        <ExternalLink url={value} className="text-blue-600 underline truncate text-sm">
          Visit project page
        </ExternalLink>
      );
    } else if (isCountry && Array.isArray(value)) {
      return (
        <div className="overflow-hidden max-w-full flex gap-1">
          <ListOfCountries countryCodes={value} />
        </div>
      );
    } else {
      return <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{value}</span>;
    }
  };

  return (
    <div className="flex items-center gap-1 pt-1 pr-1 pb-1 max-w-full">
      <IconComponent className="min-w-[16px] min-h-[16px]" />
      <div className="flex flex-row gap-1 items-center max-w-full">
        <span className="text-sm font-bold whitespace-nowrap">
          <strong>{label}</strong>
        </span>
        {getValueContent()}
      </div>
    </div>
  );
};

export const McfFamilyMeta = ({ metadata }: McfFamilyMetaProps) => {
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
