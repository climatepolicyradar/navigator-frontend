import useConfig from "@hooks/useConfig";
import { getCountryName, getCountrySlug } from "@helpers/getCountryFields";
import { CountryLink } from "@components/CountryLink";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import { TDocumentPage } from "@types";

type TProps = {
  document: TDocumentPage;
  family: {
    title: string;
    slug: string;
  };
  geography: string;
  backLink?: string;
};

export const DocumentHead = ({ document, family, geography, backLink }: TProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;
  const geoName = getCountryName(geography, countries);
  const geoSlug = getCountrySlug(geography, countries);
  const breadcrumbGeography = { label: geoName, href: `/geographies/${geoSlug}` };
  const breadcrumbFamily = { label: family.title, href: `/document/${family.slug}` };
  const isMain = document.document_role.toLowerCase().includes("main");

  return (
    <div className="bg-offwhite border-solid border-lineBorder border-b">
      <div className="container">
        <BreadCrumbs geography={breadcrumbGeography} category={null} family={breadcrumbFamily} label={document.document_role} />
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 my-4">
            <h1 className="text-3xl lg:smaller">{document.title}</h1>
            <div className="flex text-base text-grey-700 mt-4 items-center w-full font-medium divide-x gap-2 divide-grey-700">
              <CountryLink countryCode={geography} className="text-primary-400 hover:text-indigo-600 duration-300">
                <span className={`rounded-sm border border-black flag-icon-background flag-icon-${geography.toLowerCase()}`} />
                <span className="ml-2">{geoName}</span>
              </CountryLink>
              {!isMain && <span className="pl-2 capitalize">{document.document_role.toLowerCase()}</span>}
              {!!document.language && (
                <span className="pl-2">
                  {document.language.toUpperCase()}
                  {!!document.variant && ` (${document.variant})`}
                </span>
              )}
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
