import { ExternalLink } from "@components/ExternalLink";
import SearchResult from "./SearchResult";
import { TMatchedFamily } from "@types";
import { DOCUMENT_CATEGORIES } from "@constants/documentCategories";
import Button from "@components/buttons/Button";
import { UNFCCC_SURVEY } from "@constants/UNFCCCSurvey";

type TProps = {
  category?: (typeof DOCUMENT_CATEGORIES)[number];
  families: TMatchedFamily[];
};

const SearchResultList = ({ category, families }: TProps) => {
  const handleNotifiedClick = () => {
    window.open(UNFCCC_SURVEY);
  };

  const emptyMessage = (category: string) => {
    if (category !== "UNFCCC") {
      category = category.toLowerCase();
    }

    return (
      <div className="h-96 mt-4 md:mt-0">
        Your search returned no results from documents in the {category} category. Please try a different category, or conduct a new search.
      </div>
    );
  };

  if (category && category === "Litigation") {
    return (
      <div className="h-96 mt-4 md:mt-0">
        Climate litigation case documents are coming soon. In the meantime, visit the Sabin Center's{" "}
        <ExternalLink url="http://climatecasechart.com/" className="underline">Climate Change Litigation Databases</ExternalLink>.
      </div>
    );
  }
  if (category && category === "Legislation" && families.length === 0) {
    return emptyMessage(category);
  }
  if (category && category === "Policies" && families.length === 0) {
    return emptyMessage(category);
  }
  if (category && category === "UNFCCC" && families.length === 0) {
    return emptyMessage(category);
  }
  if (families.length === 0) {
    return <div className="h-96 mt-4 md:mt-0">Your search returned no results.</div>;
  }
  return (
    <>
      {families?.map((family, index: number) => (
        <div key={index} className="my-16 first:md:mt-4" data-cy="search-result">
          <SearchResult family={family} />
        </div>
      ))}
    </>
  );
};

export default SearchResultList;
