import { getIcon } from "@helpers/getMetadataIcon";
import { mapFamilyMetadata } from "@helpers/mapFamilyMetadata";
import { ExternalLink } from "@components/ExternalLink";
import { CountryLink } from "@components/CountryLink";

const getCountryLinks = (countryCodes: string[]): JSX.Element[] => {
  const countries = countryCodes.map((code, index) => (
    <div className="flex" key={code}>
      <CountryLink
        countryCode={code}
        showFlag={false}
        showSlugAsChildren={true}
        className="text-blue-600 underline truncate text-xs text-transform: capitalize"
      />
      {index !== countryCodes.length - 1 && <span>,</span>}
    </div>
  ));
  return countries;
};

const MetadataItem = ({ label, icon, value }) => {
  const isUrl = label === "Source";
  const isCountry = label === "Geography";
  const IconComponent = getIcon(icon);

  const getValueContent = () => {
    if (isUrl) {
      return (
        <ExternalLink url={value} className="text-blue-600 underline truncate text-xs">
          {" "}
          Visit project page
        </ExternalLink>
      );
    } else if (isCountry) {
      return getCountryLinks(value);
    } else {
      return <span className=" text-xs">{value}</span>;
    }
  };

  return (
    <div className="flex items-center gap-1 pt-1 pr-1 pb-1">
      <IconComponent className="w-[16px] h-[16px]" />
      <div className="flex flex-row gap-1 items-center">
        <span className="text-xs font-bold">
          <strong>{label}</strong>
        </span>
        {getValueContent()}
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
