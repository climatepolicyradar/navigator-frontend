import { CountryLink } from "@components/CountryLink";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import useConfig from "@hooks/useConfig";
import { getCountryName, getCountrySlug } from "@helpers/getCountryFields";
import { getLanguage } from "@helpers/getLanguage";
import { isSystemGeo } from "@utils/isSystemGeo";
import { TDocumentFamily, TDocumentPage } from "@types";
import Button from "@components/buttons/Button";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { ExternalLinkIcon } from "@components/svg/Icons";

type TProps = {
  document: TDocumentPage;
  family: TDocumentFamily;
};

const containsNonEnglish = (languages: string[]) => {
  return languages.some((lang) => lang !== "eng");
};

const Alert = () => (
  <div className="flex">
    <div className="w-[6px] h-full bg-blue-400 rounded-l-lg"></div>
    <div className="bg-white p-2 border border-gray-200 border-l-0 rounded-r-lg" role="alert">
      <p className="text-sm">
        English translations of this document have been provided by Google Cloud Translate. They may not be 100% accurate. Read our{" "}
        <LinkWithQuery href="/terms-of-use" className="underline">
          Terms of Use
        </LinkWithQuery>{" "}
        for more information.
      </p>
    </div>
  </div>
);

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
  const translated = containsNonEnglish(document.languages);

  const handleViewSourceClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const url = document.content_type === "application/pdf" ? document.cdn_object : document.source_url;
    if (!url) return;
    window.open(url);
  };

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
            <div className="mt-4 md:mt-0 md:flex justify-between items-center">
              <div className="flex text-sm text-grey-700 items-center font-medium gap-2">
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
              <div className="mt-4 md:mt-0">
                <Button color="clear" data-cy="view-source" onClick={handleViewSourceClick} extraClasses="flex items-center">
                  <ExternalLinkIcon height="16" width="16" /> <span className="ml-2">View source document</span>
                </Button>
              </div>
            </div>
            {translated && (
              <div className="flex mt-4">
                <Alert />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
