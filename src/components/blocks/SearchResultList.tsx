import { ExternalLink } from "@components/ExternalLink";
import SearchResult from "./SearchResult";

type TProps = {
  category?: string;
  documents: any[];
};

const SearchResultList = ({ category, documents }: TProps) => {
  if (category && category === "Litigation") {
    return (
      // TODO: translate
      <div className="h-96 mt-4 md:mt-0">
        Climate litigation case documents are coming soon. In the meantime, visit the Sabin Center’s{" "}
        <ExternalLink url="http://climatecasechart.com/">Climate Change Litigation Databases</ExternalLink>.
      </div>
    );
  }
  if (category && category === "Legislation" && documents.length === 0) {
    return (
      <div className="h-96 mt-4 md:mt-0">
        Your search returned no results from documents in the legislation category. Please try the policies category, or conduct a new search.
      </div>
    );
  }
  if (category && category === "Policies" && documents.length === 0) {
    return (
      <div className="h-96 mt-4 md:mt-0">
        Your search returned no results from documents in the policies category. Please try the legislation category, or conduct a new search.
      </div>
    );
  }
  if (documents.length === 0) {
    return <div className="h-96 mt-4 md:mt-0">Your search returned no results.</div>;
  }
  return (
    <>
      {documents?.map((doc: any, index: number) => (
        <div key={index} className="my-16 first:md:mt-4">
          <SearchResult document={doc} />
        </div>
      ))}
    </>
  );
};

export default SearchResultList;
