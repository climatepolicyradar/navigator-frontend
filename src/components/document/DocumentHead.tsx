import { CountryLink } from "@components/CountryLink";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import useConfig from "@hooks/useConfig";
import { getCountryName, getCountrySlug } from "@helpers/getCountryFields";
import { getLanguage } from "@helpers/getLanguage";
import { isSystemGeo } from "@utils/isSystemGeo";
import { TDocumentFamily, TDocumentPage } from "@types";

type TProps = {
  document: TDocumentPage;
  family: TDocumentFamily;
};

export const DocumentHead = ({ document, family }: TProps) => {
  const configQuery = useConfig();
  const { data: { countries = [], languages = {} } = {} } = configQuery;
  const geoName = getCountryName(family.geography, countries);
  const geoSlug = getCountrySlug(family.geography, countries);
  const isMain = document.document_role.toLowerCase().includes("main");
  const breadcrumbGeography = { label: geoName, href: `/geographies/${geoSlug}` };
  const breadcrumbFamily = { label: family.title, href: `/document/${family.slug}` };
  const breadcrumbLabel = isMain ? "Document" : document.document_role.toLowerCase();
  const breadcrumbCategory = { label: "Search results", href: "/search" };

  return (
    <div className="bg-white border-solid border-lineBorder border-b">
      <div className="container">
        <BreadCrumbs
          geography={breadcrumbGeography}
          category={breadcrumbCategory}
          family={breadcrumbFamily}
          label={<span className="capitalize">{breadcrumbLabel}</span>}
        />
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 my-4">
            <h1 className="text-3xl lg:smaller">{document.title}</h1>
            <div className="flex text-base text-grey-700 mt-4 items-center w-full font-medium gap-2">
              {!isSystemGeo(family.geography) && (
                <CountryLink countryCode={family.geography} className="text-primary-400 hover:text-indigo-600 duration-300">
                  <span>{geoName}</span>
                </CountryLink>
              )}
              {!isMain && (
                <>
                  <span>&middot;</span>
                  <span className="capitalize">{document.document_role.toLowerCase()}</span>
                </>
              )}
              {family.category && (
                <>
                  <span>&middot;</span>
                  <span className="capitalize">{family.category}</span>
                </>
              )}
              {!!document.language && (
                <>
                  <span>&middot;</span>
                  <span>
                    {getLanguage(document.language, languages)}
                    {!!document.variant && ` (${document.variant})`}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
