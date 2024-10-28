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
  values: string | string[];
}

type TFamilyMetadataUnion = TFamilyMetadata | TMCFFamilyMetadata;

interface McfFamilyMetaProps {
  metadata: TFamilyMetadataUnion;
}

interface ListOfCountriesProps {
  countryCodes: string[];
  icon: string;
  label: string;
}

const ListOfCountries = ({ countryCodes, icon, label }: ListOfCountriesProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  const GeographyIconComponent = getIcon(icon);

  return (
    <>
      <GeographyIconComponent className="min-w-[16px] min-h-[16px]" />
      <span className="text-sm font-bold pl-1">
        <strong>{label}</strong>
      </span>
      <CountryLinksAsList geographies={countryCodes} countries={countries} showFlag={false} />
    </>
  );
};

const MultipleValuesContentComponent = ({ label, values, icon }) => {
  const IconComponent = getIcon(icon);

  return (
    <>
      <IconComponent className="min-w-[16px] min-h-[16px]" />
      <span className="text-sm font-bold px-1">
        <strong>{label}</strong>
      </span>
      {values.map((item, index) => (
        <div key={item} className="flex items-center pr-2">
          <span key={item} className="text-sm">
            {item}
          </span>
          {index !== values.length - 1 && <span>,</span>}
        </div>
      ))}
    </>
  );
};

const MetadataItem = ({ label, icon, values }: MetadataItemProps) => {
  const isUrl = label === "Source";
  const isCountry = label === "Geography";

  const IconComponent = getIcon(icon);

  const getValueContent = () => {
    if (isUrl && typeof values === "string") {
      return (
        <ExternalLink url={values} className="text-blue-600 underline truncate text-sm">
          Visit project page
        </ExternalLink>
      );
    } else {
      return <span className="text-sm">{values}</span>;
    }
  };

  if (isCountry && Array.isArray(values)) {
    return <ListOfCountries countryCodes={values} icon={icon} label={label} />;
  }

  if (Array.isArray(values)) {
    return <MultipleValuesContentComponent values={values} icon={icon} label={label} />;
  }

  return (
    <div className="flex items-center gap-1 pt-1 pr-2 pb-1 max-w-full">
      <IconComponent className="min-w-[16px] min-h-[16px]" />
      <div className="flex flex-row gap-1 items-center max-w-full">
        <span className="text-sm font-bold ">
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
      <div className="flex flex-wrap items-center">
        {mappedMetadata.map((item, index) => (
          <MetadataItem key={index} label={item.label} icon={item.iconLabel} values={item.value} />
        ))}
      </div>
    </div>
  );
};
