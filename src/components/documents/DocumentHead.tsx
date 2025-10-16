import { MoveUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert } from "@/components/Alert";
import { ExternalLink } from "@/components/ExternalLink";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { DocumentMetaRenderer } from "@/components/documents/renderers/DocumentMetaRenderer";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";
import { MAX_FAMILY_SUMMARY_LENGTH_BRIEF } from "@/constants/document";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import useConfig from "@/hooks/useConfig";
import { TDocumentPage, TFamilyPublic } from "@/types";
import { truncateString } from "@/utils/truncateString";

interface IProps {
  document: TDocumentPage;
  family: TFamilyPublic;
  handleViewOtherDocsClick: (e: React.FormEvent<HTMLButtonElement>) => void;
  handleViewSourceClick: (e: React.FormEvent<HTMLButtonElement>) => void;
}

const containsNonEnglish = (languages: string[]) => {
  return languages.some((lang) => lang !== "eng");
};

export const DocumentHead = ({ document, family, handleViewOtherDocsClick, handleViewSourceClick }: IProps) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const configQuery = useConfig();
  const { data: { countries = [], languages = {} } = {} } = configQuery;

  const geographyNames = family.geographies ? family.geographies.map((geo) => getCountryName(geo, countries)) : null;
  const geoName = geographyNames ? geographyNames[0] : "";
  const geoSlug = family.geographies ? getCountrySlug(family.geographies[0], countries) : "";
  const isMain = document.document_role.toLowerCase().includes("main");
  const breadcrumbGeography = family.geographies && family.geographies.length > 1 ? null : { label: geoName, href: `/geographies/${geoSlug}` };
  const breadcrumbFamily = {
    label: family.title,
    href: `/document/${family.slug}`,
  };
  const breadcrumbLabel = isMain ? "Document" : document.document_role.toLowerCase();
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
    <div className="bg-white border-solid border-lineBorder border-b border-gray-300">
      <BreadCrumbs
        geography={breadcrumbGeography}
        family={breadcrumbFamily}
        label={breadcrumbLabel ? <span className="capitalize">{breadcrumbLabel}</span> : document.title}
      />
      <SiteWidth>
        <div className="flex flex-col justify-between lg:flex-row flex-wrap">
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
                <MoveUpRight height="16" width="16" />
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
