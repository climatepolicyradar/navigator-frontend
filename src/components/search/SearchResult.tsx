import { Button } from "@components/atoms/button/Button";
import { FamilyListItem } from "@components/document/FamilyListItem";
import { Icon } from "@components/icon/Icon";
import { ToolTipSSR } from "@components/tooltip/TooltipSSR";
import { MAX_RESULTS } from "@constants/paging";
import { TMatchedFamily } from "@types";
interface ISearchResultProps {
  family: TMatchedFamily;
  active: boolean;
  onClick?: () => void;
}

const SearchResult = ({ family, active, onClick }: ISearchResultProps) => {
  const { family_documents, total_passage_hits, family_slug } = family;

  const matchesNumber = total_passage_hits >= MAX_RESULTS ? `${MAX_RESULTS}+` : `${total_passage_hits}`;
  const matchesText = `${matchesNumber} ${total_passage_hits === 1 ? "match" : "matches"} in documents`;

  return (
    <FamilyListItem family={family}>
      {family_documents.length > 0 && (
        <div>
          <div className="inline-block" data-tooltip-content="View passages in this document that match your search" data-tooltip-id={family_slug}>
            <Button
              color={active ? "brand" : "mono"}
              content="both"
              rounded
              size="small"
              variant={active ? "faded" : "outlined"}
              onClick={onClick}
              aria-label={matchesText}
              data-analytics="search-result-matches-button"
              data-slug={family_slug}
            >
              <Icon name="documentMagnify" width="16" height="16" />
              {matchesText}
            </Button>
            <ToolTipSSR id={family_slug} place={"top"} />
          </div>
        </div>
      )}
    </FamilyListItem>
  );
};

export default SearchResult;
