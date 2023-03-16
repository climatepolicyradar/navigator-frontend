import { CountryLink } from "@components/CountryLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { getCountryName } from "@helpers/getCountryFields";
import useConfig from "@hooks/useConfig";
import { TDocumentPage } from "@types";
import { convertDate } from "@utils/timedate";

type TProps = {
  document: TDocumentPage;
  date: string;
  geography: string;
  backLink?: string;
};

export const DocumentHead = ({ document, date, geography, backLink }: TProps) => {
  const configQuery: any = useConfig("config");
  const { data: { countries = [] } = {} } = configQuery;
  const geoName = getCountryName(geography, countries);
  const [year] = convertDate(date);

  return (
    <div className="bg-offwhite border-solid border-lineBorder border-b">
      <div className="container">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 my-4">
            <h1 className="text-3xl lg:smaller">{document.title}</h1>
            <div className="flex text-base text-grey-700 mt-4 items-center w-full font-medium divide-x gap-2 divide-grey-700">
              <CountryLink countryCode={geography} className="text-primary-400 hover:text-indigo-600 duration-300">
                <span className={`rounded-sm border border-black flag-icon-background flag-icon-${geography.toLowerCase()}`} />
                <span className="ml-2">{geoName}</span>
              </CountryLink>
              <span className="pl-2">{year}</span>
              {document.variant && <span className="pl-2 capitalize">{document.variant.toLowerCase()}</span>}
            </div>
            {backLink && (
              <div className="mt-4">
                <LinkWithQuery href={`/document/${backLink}`} className="text-primary-400 hover:underline">
                  View document details
                </LinkWithQuery>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
