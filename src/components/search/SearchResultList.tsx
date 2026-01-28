import { ExternalLink } from "@/components/ExternalLink";
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
          Climate litigation case documents are coming soon.{" "}
          <ExternalLink url="https://form.jotform.com/233294371485361" className="underline text-blue-600 hover:text-blue-800">
            Get notified when they arrive
          </ExternalLink>
          .
        </p>
        <p className="my-4 md:mt-0">
          In the meantime, visit the Sabin Center's{" "}
          <ExternalLink url="http://climatecasechart.com/" className="underline text-blue-600 hover:text-blue-800">
            Climate Change Litigation Databases
          </ExternalLink>
          .
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
      <ol className="divide-y flex flex-col gap-6" data-cy="search-result">
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
