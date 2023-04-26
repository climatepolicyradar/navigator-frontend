import { useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ApiClient } from "@api/http-common";
import { DocumentHead } from "@components/document/DocumentHead";
import Layout from "@components/layouts/Main";
import EmbeddedPDF from "@components/EmbeddedPDF";
import PassageMatches from "@components/PassageMatches";
import { TDocumentPage } from "@types";
import useSearch from "@hooks/useSearch";
import { QUERY_PARAMS } from "@constants/queryParams";
import Loader from "@components/Loader";
import Button from "@components/buttons/SquareButton";
import useConfig from "@hooks/useConfig";
import { getCountryName } from "@helpers/getCountryFields";
import { getDocumentDescription } from "@constants/metaDescriptions";

type TDocFamily = {
  title: string;
  import_id: string;
  geography: string;
  slug: string;
  published_date: string;
  last_updated_date: string;
};

type TProps = {
  document: TDocumentPage;
  family: TDocFamily;
};

const DocumentPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ document, family }: TProps) => {
  const [passageIndex, setPassageIndex] = useState(null);
  const router = useRouter();

  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;
  const geographyName = getCountryName(family.geography, countries);

  const passageMatches = [];
  const { status, families } = useSearch(router.query, !!router.query[QUERY_PARAMS.query_string]);
  if (!!router.query[QUERY_PARAMS.query_string]) {
    families.forEach((family) => {
      family.family_documents.forEach((cacheDoc) => {
        if (document.slug === cacheDoc.document_slug) {
          passageMatches.push(...cacheDoc.document_passage_matches);
        }
      });
    });
  }

  const handleViewSourceClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const url = document.content_type === "application/pdf" ? document.cdn_object : document.source_url;
    if (!url) return;
    window.open(url);
  };

  const handlePassageClick = (index: number) => {
    setPassageIndex(index);
    setTimeout(() => {
      window.document.getElementById("document-viewer").scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <Layout title={`${document.title} - ${geographyName}`} description={getDocumentDescription(document.title)}>
      <section
        className="mb-8 flex-1 flex flex-col"
        data-analytics-date={family.published_date}
        data-analytics-geography={family.geography}
        data-analytics-variant={document.variant}
        data-analytics-type={document.content_type}
      >
        <DocumentHead document={document} geography={family.geography} backLink={family.slug} />
        {status !== "success" ? (
          <div className="w-full flex justify-center flex-1">
            <Loader />
          </div>
        ) : (
          <section className="pt-4 flex-1 flex" id="document-viewer">
            <div className="container flex-1">
              <div className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-lineBorder gap-4">
                {passageMatches.length > 0 && (
                  <h3>Document matches for {`'${router.query[QUERY_PARAMS.query_string]}' (${passageMatches.length})`}</h3>
                )}
                <div className="flex-1 flex justify-end">
                  <Button data-cy="view-source" onClick={handleViewSourceClick}>
                    View source document
                  </Button>
                </div>
              </div>
              {document.content_type === "application/pdf" && (
                <div className="md:flex md:h-[80vh]">
                  {passageMatches.length > 0 && (
                    <div className="md:block md:w-1/3 overflow-y-scroll pr-4 max-h-[30vh] md:max-h-full">
                      <PassageMatches passages={passageMatches} onClick={handlePassageClick} activeIndex={passageIndex} />
                    </div>
                  )}
                  {status === "success" && (
                    <div className="md:block mt-4 flex-1 h-[400px] md:h-full">
                      <EmbeddedPDF document={document} documentPassageMatches={passageMatches} passageIndex={passageIndex} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </Layout>
  );
};

export default DocumentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const id = context.params.id;
  const client = new ApiClient(process.env.API_URL);

  let documentData: TDocumentPage;
  let familyData: TDocFamily;

  try {
    const { data: returnedData } = await client.get(`/documents/${id}`, { group_documents: true });
    documentData = returnedData.document;
    familyData = returnedData.family;
  } catch {
    // TODO: Handle error more gracefully
  }

  if (!documentData || !familyData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      document: documentData,
      family: familyData,
    },
  };
};
