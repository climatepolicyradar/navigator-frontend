import { useEffect, useState } from "react";
import { LuMoveUpRight } from "react-icons/lu";

import useConfig from "@hooks/useConfig";

import { SiteWidth } from "@/components/panels/SiteWidth";

import { SubNav } from "@/components/nav/SubNav";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { Alert } from "@/components/Alert";
import { ExternalLink } from "@/components/ExternalLink";
import { Heading } from "@/components/typography/Heading";

import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { truncateString } from "@utils/truncateString";

import { MAX_FAMILY_SUMMARY_LENGTH_BRIEF } from "@/constants/document";

import { TDocumentPage, TFamilyPage } from "@types";
import { DocumentMetaRenderer } from "./renderers/DocumentMetaRenderer";

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

  const geographyNames = family.geographies ? family.geographies.map((geo) => getCountryName(geo, countries)) : null;
  const geoName = geographyNames ? geographyNames[0] : "";
  const geoSlug = family.geographies ? getCountrySlug(family.geographies[0], countries) : "";
  const isMain = document.document_role.toLowerCase().includes("main");
  const breadcrumbGeography = family.geographies && family.geographies.length > 1 ? null : { label: geoName, href: `/geographies/${geoSlug}` };
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
    <div className="bg-white border-solid border-lineBorder border-b border-gray-200">
      <SubNav>
        <BreadCrumbs
          geography={breadcrumbGeography}
          category={breadcrumbCategory}
          family={breadcrumbFamily}
          label={breadcrumbLabel ? <span className="capitalize">{breadcrumbLabel}</span> : document.title}
        />
      </SubNav>
      <SiteWidth>
        <div className="flex flex-col justify-between md:flex-row flex-wrap">
          <div className="flex-1 my-4">
            <Heading level={1}>{document.title}</Heading>
            <DocumentMetaRenderer family={family} isMain={isMain} document={document} />

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
            <div className="my-4 flex flex-row gap-2 lg:flex-col">
              {family.documents.length > 1 && (
                <Button color="mono" rounded variant="outlined" onClick={handleViewOtherDocsClick} data-cy="view-source">
                  Other documents in this entry ({family.documents.length})
                </Button>
              )}
              <Button
                color="mono"
                content="both"
                rounded
                variant="outlined"
                className="justify-between"
                onClick={handleViewSourceClick}
                data-cy="view-source"
              >
                View source document
                <LuMoveUpRight height="16" width="16" />
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
                  <ExternalLink url="https://form.jotform.com/233293886694373" className="underline text-blue-600 hover:text-blue-800">
                    Get notified when full document translations are available.
                  </ExternalLink>
                </>
              }
              icon={<Icon name="alertCircle" height="16" width="16" />}
            />
          </div>
        )}
      </SiteWidth>
    </div>
  );
};
