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

type TDocFamily = {
  title: string;
  import_id: string;
  geography: string;
  slugs: string[];
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

  const passageMatches = [];
  const { status, families } = useSearch(router.query, !!router.query[QUERY_PARAMS.query_string]);
  if (!!router.query[QUERY_PARAMS.query_string]) {
    families.forEach((family) => {
      family.family_documents.forEach((cacheDoc) => {
        if (document.slugs.includes(cacheDoc.document_slug)) {
          passageMatches.push(...cacheDoc.document_passage_matches);
        }
      });
    });
  }

  return (
    <Layout title={document.title}>
      <section
        className="mb-8 flex-1 flex flex-col"
        data-analytics-date={family.published_date}
        data-analytics-geography={family.geography}
        data-analytics-variant={document.variant}
        data-analytics-type={document.content_type}
      >
        <DocumentHead document={document} date={family.published_date} geography={family.geography} backLink={family.slugs[0]} />
        {status !== "fetched" ? (
          <div className="w-full flex justify-center flex-1">
            <Loader />
          </div>
        ) : (
          <section className="mt-4 flex-1 flex">
            <div className="container flex-1">
              {passageMatches.length > 0 && (
                <div className="pb-4 border-b border-lineBorder">
                  <h3>Document matches for {`'${router.query[QUERY_PARAMS.query_string]}' (${passageMatches.length})`}</h3>
                </div>
              )}
              <div className="md:flex md:h-[80vh]">
                {passageMatches.length > 0 && (
                  <div className="md:block md:w-1/3 overflow-y-scroll pr-4 max-h-[30vh] md:max-h-full">
                    <PassageMatches passages={passageMatches} setPassageIndex={setPassageIndex} activeIndex={passageIndex} />
                  </div>
                )}
                {status === "fetched" && (
                  <div className="md:block mt-4 flex-1 h-[400px] md:h-full">
                    <EmbeddedPDF document={document} documentPassageMatches={passageMatches} passageIndex={passageIndex} />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </section>
    </Layout>
  );
};

export default DocumentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
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
