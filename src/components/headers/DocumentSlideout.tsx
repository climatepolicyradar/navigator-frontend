import { TDocument } from "@types";
import useConfig from "@hooks/useConfig";
import DocumentMenu from "../menus/DocumentMenu";
import TextLink from "../nav/TextLink";
import { getDocumentTitle } from "@helpers/getDocumentTitle";
import { getCountryName } from "@helpers/getCountryFields";
import { LinkWithQuery } from "@components/LinkWithQuery";

type TProps = {
  document: TDocument;
  searchTerm: string;
  showPDF: boolean;
  setShowPDF: (show?: boolean) => void;
};

const DocumentSlideout = ({ document, searchTerm, showPDF, setShowPDF }: TProps) => {
  const configQuery: any = useConfig("config");
  const { data: { countries = [] } = {} } = configQuery;

  if (!document) return null;

  const year = document?.document_date.split("/")[2] ?? "";

  const country_name = getCountryName(document.document_geography, countries);

  return (
    <>
      {document ? (
        <>
          <div className="border-b border-lineBorder pb-4 flex justify-between relative">
            <div className="pl-6 pr-10 mt-2">
              <LinkWithQuery href={`/document/${document.document_slug}`}>
                <h1 className="text-lg text-blue-500 font-medium">{getDocumentTitle(document.document_name, document.document_postfix)}</h1>
              </LinkWithQuery>
              <div className="flex flex-wrap lg:flex-nowrap text-sm text-indigo-400 my-2 items-center">
                <div className={`rounded-sm border border-black flag-icon-background flag-icon-${document.document_geography.toLowerCase()}`} />
                <span className="ml-2">
                  {country_name}, {year}
                </span>
              </div>
              <h3 className="text-indigo-500 text-xl">
                Document {`match${document.document_passage_matches.length === 1 ? "" : "es"}`} ({document.document_passage_matches.length}) for "
                {searchTerm}"
              </h3>
            </div>
            <DocumentMenu document={document} />
          </div>
          {showPDF && (
            <div className="md:hidden ml-6">
              <TextLink onClick={() => setShowPDF(false)}>
                <span className="text-lg">&laquo;</span>Back to passage matches
              </TextLink>
            </div>
          )}
        </>
      ) : null}
    </>
  );
};
export default DocumentSlideout;
