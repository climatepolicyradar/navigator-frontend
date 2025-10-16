import { useRouter } from "next/router";

import { Icon } from "@/components/atoms/icon/Icon";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { getDocumentType } from "@/helpers/getDocumentType";
import { getLanguage } from "@/helpers/getLanguage";
import useConfig from "@/hooks/useConfig";
import { TConcept, TDocumentPage, TLoadingStatus } from "@/types";
import { getPassageResultsContext } from "@/utils/getPassageResultsContext";

interface IProps {
  document: TDocumentPage;
  matches?: number;
  status?: TLoadingStatus;
  familyMatches?: number;
  concepts?: TConcept[];
}

const LoadingIndicator = (
  <span className="flex gap-2 items-center">
    <Icon name="loading" />
    Searching...
  </span>
);

export const FamilyDocument = ({ document, matches, status, familyMatches, concepts }: IProps) => {
  const { title, slug, document_role, language, content_type, variant } = document;
  const configQuery = useConfig();
  const { data: { languages = {} } = {} } = configQuery;
  const router = useRouter();
  const isMain = document_role?.toLowerCase().includes("main");
  const hasMatches = typeof matches !== "undefined" && matches > 0;
  // If we have matches or the document is a pdf - and we have the document, we can preview it
  const canPreview = hasMatches || (!!document.cdn_object && document.cdn_object.toLowerCase().endsWith(".pdf"));
  const canViewSource = !canPreview && !!document.source_url;

  const renderDocumentInfo = (): string | JSX.Element => {
    if (status === "loading") return LoadingIndicator;
    if (canViewSource) return "Document preview is not currently available";
    return "We do not have this document in our database. Contact us if you can help us find it";
  };

  const renderMatchesOverrideText = (): string | JSX.Element => {
    if (status === "loading") return LoadingIndicator;
  };

  const getPreviewBehaviour = () => {
    let cssClass = "family-document group mt-4 p-4 rounded-lg border bg-gray-50 border-gray-100 shadow-xs transition duration-300 flex flex-no-wrap ";
    cssClass += canPreview || canViewSource ? "cursor-pointer hover:border-blue-100 hover:bg-gray-50" : "";

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      // Otherwise either preview or open the source url
      if (canPreview) router.push({ pathname: `/documents/${slug}`, query: router.query });
      if (canViewSource) window.open(document.source_url, "_blank");
    };

    return {
      className: cssClass,
      onClick: !canPreview && !canViewSource ? null : handleClick,
    };
  };

  const getMatchesText = () => {
    const overrideText = renderMatchesOverrideText();
    if (overrideText) return overrideText;

    const numberOfMatches = typeof matches === "number" ? matches : parseInt(matches, 10);
    if (!numberOfMatches) return "";

    const conceptsQuery = router.query[QUERY_PARAMS.concept_name];
    const conceptFiltersQuery = conceptsQuery ? (Array.isArray(conceptsQuery) ? conceptsQuery : [conceptsQuery]) : undefined;
    const appliedConcepts =
      conceptFiltersQuery && concepts
        ? concepts.filter((concept) =>
            (Array.isArray(conceptFiltersQuery) ? conceptFiltersQuery : [conceptFiltersQuery]).includes(concept.preferred_label)
          )
        : [];

    return getPassageResultsContext({
      isExactSearch: router.query[QUERY_PARAMS.exact_match] !== "false",
      passageMatches: matches,
      queryTerm: router.query[QUERY_PARAMS.query_string],
      selectedTopics: appliedConcepts,
    });
  };

  return (
    <div {...getPreviewBehaviour()}>
      <div className="flex-0 mr-2 hidden md:block">
        {canViewSource && <Icon name="globe" width="20" height="20" color="#1F93FF" />}
        {canPreview && !canViewSource && <Icon name="document" width="20" height="20" color="#1F93FF" />}
      </div>
      <div className="flex-1">
        <div className="mb-2">{title} </div>
        <div className="md:flex flex-nowrap items-center">
          <div className="flex-1">
            <div className="flex items-center text-sm">
              <div className="flex-1 flex flex-wrap gap-x-2 items-center middot-between">
                {!!language && (
                  <span>
                    {getLanguage(language, languages)}
                    {!!variant && ` (${variant})`}
                  </span>
                )}
                {!isMain && <span className="capitalize">{document_role?.toLowerCase()}</span>}
                {getDocumentType(content_type)}
                {!canPreview && <span className="flex gap-2 items-center">{renderDocumentInfo()}</span>}
              </div>
            </div>
          </div>
        </div>
        {(canPreview || canViewSource) && (
          <div className="mt-2 text-sm !text-text-brand" data-analytics="document-matches-button" data-cy="document-matches-button" data-slug={slug}>
            {getMatchesText()}
          </div>
        )}
      </div>
    </div>
  );
};
