import useConfig from "@hooks/useConfig";
import { CountryLink } from "@components/CountryLink";
import { TFamilyPage } from "@types";
import { convertDate } from "@utils/timedate";
import { getCountryName } from "@helpers/getCountryFields";

type TProps = {
  family: TFamilyPage;
  onCollectionClick?: (e: any) => void;
};

export const FamilyHead = ({ family, onCollectionClick }: TProps) => {
  const configQuery: any = useConfig("config");
  const { data: { countries = [] } = {} } = configQuery;
  const geoName = getCountryName(family.geography, countries);

  const [year] = convertDate(family.published_date);

  return (
    <div className="bg-offwhite border-solid border-lineBorder border-b">
      <div className="container">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 my-4">
            <h1 className="text-3xl lg:smaller">{document.title}</h1>
            {family.collections.length > 0 && (
              <div className="flex text-base text-indigo-400 mt-4 items-center w-full mb-2 font-medium">
                <span>Part of &nbsp;</span>
                {/* {onCollectionClick ? (
                  <a onClick={onCollectionClick} href="#collection" className="underline text-primary-400 hover:text-indigo-600 duration-300">
                    {family.collections.name}
                  </a>
                ) : (
                  document?.collection.name
                )} */}
              </div>
            )}
            <div className="flex text-base text-grey-700 mt-4 items-center w-full font-medium divide-x gap-2 divide-grey-700">
              <CountryLink countryCode={family.geography} className="text-primary-400 hover:text-indigo-600 duration-300">
                <span className={`rounded-sm border border-black flag-icon-background flag-icon-${family.geography.toLowerCase()}`} />
                <span className="ml-2">{geoName}</span>
              </CountryLink>
              <span className="pl-2">{year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
