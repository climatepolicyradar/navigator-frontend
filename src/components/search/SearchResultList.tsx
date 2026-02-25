import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { TMatchedFamily } from "@/types";

import SearchResult from "./SearchResult";

interface IProps {
  category?: string;
  families: TMatchedFamily[];
  activeFamilyIndex?: number | boolean;
  onClick?: (index: number) => void;
  offset?: number;
}

const renderEmptyMessage = (category: string) => {
  if (category !== "UNFCCC") {
    category = category.toLowerCase();
  }

  return (
    <div className="h-96 mt-4 md:mt-0">
      Your search returned no results from documents in the {category} category. Please try a different category, or conduct a new search.
    </div>
  );
};

const SearchResultList = ({ category, families, activeFamilyIndex, onClick, offset = 0 }: IProps) => {
  if (category && category.toLowerCase() === "litigation") {
    return (
      <>
        <p className="my-4 md:mt-0">
          Visit the{" "}
          <PageLink external href="https://www.climatecasechart.com/" className="text-brand underline">
            Climate Litigation Database
          </PageLink>{" "}
          to see litigation documents.
        </p>
      </>
    );
  }
  if (category && category === "Laws" && families.length === 0) {
    return renderEmptyMessage(category);
  }
  if (category && category === "Policies" && families.length === 0) {
    return renderEmptyMessage(category);
  }
  if (category && category === "UNFCCC" && families.length === 0) {
    return renderEmptyMessage(category);
  }
  if (category && category === "MCF" && families.length === 0) {
    return renderEmptyMessage("multilateral climate funds");
  }
  if (families.length === 0) {
    return <div className="h-96 mt-4 md:mt-0">Your search returned no results.</div>;
  }
  return (
    <>
      <ol className="divide-y flex flex-col gap-6" aria-label="Search results">
        {families?.map((family, index: number) => (
          <SearchResult
            active={activeFamilyIndex === index}
            family={family}
            key={index}
            onClick={() => onClick(index)}
            position={index + 1}
            positionOffset={offset}
          />
        ))}
      </ol>
    </>
  );
};

export default SearchResultList;
