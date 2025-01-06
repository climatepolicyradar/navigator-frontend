import { ExternalLink } from "@components/ExternalLink";
import SearchResult from "./SearchResult";

import { TMatchedFamily } from "@types";

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
  if (category && category === "Litigation") {
    return (
      <>
        <p className="my-4 md:mt-0">
          Climate litigation case documents are coming soon.{" "}
          <ExternalLink url="https://form.jotform.com/233294371485361" className="underline">
            Get notified when they arrive
          </ExternalLink>
          .
        </p>
        <p className="my-4 md:mt-0">
          In the meantime, visit the Sabin Center's{" "}
          <ExternalLink url="http://climatecasechart.com/" className="underline">
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
      {families?.map((family, index: number) => (
        <li key={index} className={`my-10 ${index === 0 && "md:mt-0"}`} data-cy="search-result">
          <SearchResult family={family} onClick={() => onClick(index)} active={activeFamilyIndex === index} />
        </li>
      ))}
    </>
  );
};

export default SearchResultList;
