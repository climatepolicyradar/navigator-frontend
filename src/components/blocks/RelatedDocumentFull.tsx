import { convertDate } from "@utils/timedate";
import { TDocument } from "@types";
import { DocumentListItem } from "@components/document/DocumentListItem";

type TProps = {
  document: TDocument;
};

export const RelatedDocumentFull = ({ document }: TProps) => {
  const { document_geography, document_postfix, document_slug, document_date, document_description, document_name, document_category } = document;
  const [year] = convertDate(document_date);

  // TODO: update with families when available
  return null;
  
  // return (
  //   <DocumentListItem
  //     document={}
  //   />
  // );
};
