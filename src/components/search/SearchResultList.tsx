import SearchResult from "./SearchResult";

import { TMatchedFamily } from "@/types";

type TProps = {
  category?: string;
  families: TMatchedFamily[];
  activeFamilyIndex?: number | boolean;
  onClick?: (index: number) => void;
};

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

const SearchResultList = ({ category, families, activeFamilyIndex, onClick }: TProps) => {
  if (category && category === "Litigation" && families.length === 0) {
    return renderEmptyMessage(category);
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
      {families?.map((family, index: number) => (
        <div key={index} className={`my-10 ${index === 0 && "md:mt-0"}`} data-cy="search-result">
          <SearchResult family={family} onClick={() => onClick(index)} active={activeFamilyIndex === index} />
        </div>
      ))}
    </>
  );
};

export default SearchResultList;
