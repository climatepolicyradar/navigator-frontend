import useConfig from "@hooks/useConfig";

import { ExternalLink } from "@components/ExternalLink";
import { CountryLinksAsList } from "@components/CountryLinks";

import { mapFamilyMetadata } from "@helpers/mapFamilyMetadata";

import { TConcept, TFamilyMetadata, TMCFFamilyMetadata } from "@types";
import { LinkWithQuery } from "@components/LinkWithQuery";

interface MetadataItemProps {
  label: string;
  values: string | string[];
}

type TFamilyMetadataUnion = TFamilyMetadata | TMCFFamilyMetadata;

interface McfFamilyMetaProps {
  metadata: TFamilyMetadataUnion;
  concepts?: (TConcept & { count: number })[];
}

interface ListOfCountriesProps {
  countryCodes: string[];
  label: string;
}

interface MultipleValuesContentProps {
  label: string;
  values: string[];
}

const ListOfCountries = ({ countryCodes, label }: ListOfCountriesProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  return (
    <>
      <div className="flex row items-center">
        <span className="text-sm font-bold pl-1">
          <strong>{label}</strong>
        </span>
      </div>
      <CountryLinksAsList geographies={countryCodes} countries={countries} showFlag={false} />
    </>
  );
};

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
  const isCountry = label === "Geography";

  const getValueContent = () => {
    if (isUrl && typeof values === "string") {
      return (
        <ExternalLink url={values} className="text-blue-600 underline truncate text-sm pl-1">
          Visit project page
        </ExternalLink>
      );
    } else {
      return <span className="pl-1 text-sm">{values}</span>;
    }
  };

  if (isCountry && Array.isArray(values)) {
    return <ListOfCountries countryCodes={values} label={label} />;
  }

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

export const McfFamilyMeta = ({ metadata, concepts }: McfFamilyMetaProps) => {
  const mappedMetadata = mapFamilyMetadata(metadata);

  return (
    <div className="w-full bg-white py-4 flex flex-col gap-2">
      {mappedMetadata.map((item, index) => (
        <div className="flex flex-wrap gap-1" key={item.label}>
          <MetadataItem key={index} label={item.label} values={item.value} />
        </div>
      ))}
      {concepts && concepts.length > 0 && (
        <>
          <div className="flex items-center row">
            <span className="pl-1">
              <span className="text-sm font-bold">
                <strong>Concepts</strong>
              </span>
            </span>
            {concepts.map((concept, index) => (
              <span key={concept.wikibase_id} className="flex items-center">
                <LinkWithQuery className="capitalize pl-1 text-sm" href={`/concepts/${concept.wikibase_id}`}>
                  {concept.preferred_label}
                </LinkWithQuery>
                {index < concepts.length - 1 && ", "}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
