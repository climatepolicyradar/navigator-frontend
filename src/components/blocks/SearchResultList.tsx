import { ExternalLink } from "@components/ExternalLink";
import SearchResult from "./SearchResult";
import { TMatchedFamily } from "@types";
import { DOCUMENT_CATEGORIES } from "@constants/documentCategories";
import Button from "@components/buttons/Button";

type TProps = {
  category?: (typeof DOCUMENT_CATEGORIES)[number];
  families: TMatchedFamily[];
};

const SearchResultList = ({ category, families }: TProps) => {
  const handleNotifiedClick = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSfpo03ytni3SmEqXfFRW38qz1OGyNgN5HhQF-6fW-QcSLZ67A/viewform");
  };

  if (category && category === "Litigation") {
    return (
      <div className="h-96 mt-4 md:mt-0">
        Climate litigation case documents are coming soon. In the meantime, visit the Sabin Center's{" "}
        <ExternalLink url="http://climatecasechart.com/">Climate Change Litigation Databases</ExternalLink>.
      </div>
    );
  }
  if (category && category === "Legislation" && families.length === 0) {
    return (
      <div className="h-96 mt-4 md:mt-0">
        Your search returned no results from documents in the legislation category. Please try the policies category, or conduct a new search.
      </div>
    );
  }
  if (category && category === "Policies" && families.length === 0) {
    return (
      <div className="h-96 mt-4 md:mt-0">
        Your search returned no results from documents in the policies category. Please try the legislation category, or conduct a new search.
      </div>
    );
  }
  if (category && category === "UNFCCC" && families.length === 0) {
    return (
      <div className="h-96 mt-4 md:mt-0">
        <p>
          Documents from UNFCCC Portals, including submissions under the first Global Stocktake, nationally determined contributions and adaptation
          communications, and also IPCC reports will be available here soon.{" "}
          <ExternalLink
            className="underline"
            url="https://docs.google.com/forms/d/e/1FAIpQLSfpo03ytni3SmEqXfFRW38qz1OGyNgN5HhQF-6fW-QcSLZ67A/viewform"
          >
            Get notified when it's ready or help us design this
          </ExternalLink>
          .
        </p>
        <Button extraClasses="mt-4" onClick={handleNotifiedClick}>
          Get notified
        </Button>
      </div>
    );
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
