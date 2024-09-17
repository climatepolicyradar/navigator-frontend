import { useEffect, useState } from "react";
import useConfig from "@hooks/useConfig";

import { CountryLink } from "@components/CountryLink";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import Button from "@components/buttons/Button";
import { ExternalLinkIcon, AlertCircleIcon } from "@components/svg/Icons";
import { Alert } from "@components/Alert";
import { ExternalLink } from "@components/ExternalLink";

import { getLanguage } from "@helpers/getLanguage";
import { getCountryName, getCountrySlug } from "@helpers/getCountryFields";

import { truncateString } from "@utils/truncateString";
import { isSystemGeo } from "@utils/isSystemGeo";

import { MAX_FAMILY_SUMMARY_LENGTH_BRIEF } from "@constants/document";

import { TDocumentPage, TFamilyPage } from "@types";

type TProps = {
  document: TDocumentPage;
  family: TFamilyPage;
  handleViewOtherDocsClick: (e: React.FormEvent<HTMLButtonElement>) => void;
  handleViewSourceClick: (e: React.FormEvent<HTMLButtonElement>) => void;
};

const containsNonEnglish = (languages: string[]) => {
  return languages.some((lang) => lang !== "eng");
};

export const DocumentHead = ({ document, family, handleViewOtherDocsClick, handleViewSourceClick }: TProps) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const configQuery = useConfig();
  const { data: { countries = [], languages = {} } = {} } = configQuery;
  const geoName = getCountryName(family.geography, countries);
  const geoSlug = getCountrySlug(family.geography, countries);
  const isMain = document.document_role.toLowerCase().includes("main");
  const breadcrumbGeography = { label: geoName, href: `/geographies/${geoSlug}` };
  const breadcrumbFamily = { label: family.title, href: `/document/${family.slug}` };
  const breadcrumbLabel = isMain ? "Document" : document.document_role.toLowerCase();
  const breadcrumbCategory = { label: "Search results", href: "/search" };
  const translated = document.languages.length === 0 || containsNonEnglish(document.languages);

  useEffect(() => {
    if (family?.summary) {
      const text = family?.summary;
      if (showFullSummary) {
        setSummary(text);
      } else {
        setSummary(truncateString(text, MAX_FAMILY_SUMMARY_LENGTH_BRIEF));
      }
    }
  }, [family, showFullSummary]);

  return (
    <div className="bg-white border-solid border-lineBorder border-b">
      <div className="container">
        <BreadCrumbs
          geography={breadcrumbGeography}
          category={breadcrumbCategory}
          family={breadcrumbFamily}
          label={<span className="capitalize">{breadcrumbLabel}</span>}
        />
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 my-4">
            <h1 className="text-3xl lg:smaller">{document.title}</h1>
            <div className="my-4 md:my-2 md:flex justify-between items-center">
              <div className="flex text-sm text-grey-700 items-center font-medium gap-2 middot-between">
                {!isSystemGeo(family.geography) && (
                  <span className="flex gap-1">
                    <CountryLink countryCode={family.geography} className="text-primary-400 hover:text-indigo-600 duration-300">
                      <span>{geoName}</span>
                    </CountryLink>
                  </span>
                )}
                {!isMain && <span className="capitalize">{document.document_role.toLowerCase()}</span>}
                {family.category && <span className="capitalize">{family.category}</span>}
                {!!document.language && (
                  <span>
                    {getLanguage(document.language, languages)}
                    {!!document.variant && ` (${document.variant})`}
                  </span>
                )}
              </div>
            </div>
            <div className="text-content" dangerouslySetInnerHTML={{ __html: summary }} />
            {family.summary.length > MAX_FAMILY_SUMMARY_LENGTH_BRIEF && (
              <div className="mt-4">
                <button onClick={() => setShowFullSummary(!showFullSummary)} className="anchor alt text-sm">
                  {showFullSummary ? "Hide full summary" : "Read more"}
                </button>
              </div>
            )}
          </div>
          <div>
            <div className="my-4 flex flex-col gap-2 xl:flex-row">
              {family.documents.length > 1 && (
                <Button color="clear" data-cy="view-source" onClick={handleViewOtherDocsClick} extraClasses="flex items-center text-sm">
                  Other documents in this entry ({family.documents.length})
                </Button>
              )}
              <Button color="clear" data-cy="view-source" onClick={handleViewSourceClick} extraClasses="flex items-center text-sm">
                <span className="mr-2">View source document</span>
                <ExternalLinkIcon height="16" width="16" />
              </Button>
            </div>
          </div>
        </div>
        {translated && (
          <div className="flex my-4">
            <Alert
              message={
                <>
                  Any English translations of this document have been provided by Google Cloud Translate. They may not be 100% accurate.{" "}
                  <ExternalLink url="https://form.jotform.com/233293886694373">
                    Get notified when full document translations are available.
                  </ExternalLink>
                </>
              }
              icon={<AlertCircleIcon height="16" width="16" />}
            />
          </div>
        )}
      </div>
    </div>
  );
};
