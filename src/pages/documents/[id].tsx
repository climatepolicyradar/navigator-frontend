import { useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ApiClient } from "@api/http-common";
import { DocumentHead } from "@components/document/DocumentHead";
import Layout from "@components/layouts/Main";
import EmbeddedPDF from "@components/EmbeddedPDF";
import PassageMatches from "@components/PassageMatches";

import { TPhysicalDocument } from "@types";
import useSearch from "@hooks/useSearch";
import { QUERY_PARAMS } from "@constants/queryParams";

type TProps = {
  document: TPhysicalDocument;
};

const DocumentPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ document }: TProps) => {
  const router = useRouter();
  const { status, families } = useSearch(router.query, !!router.query[QUERY_PARAMS.query_string]);
  const passageMatches = [];
  if (!!router.query[QUERY_PARAMS.query_string]) {
    families.forEach((family) => {
      family.family_documents.forEach((doc) => {
        if (doc.document_slug === document.slug) {
          passageMatches.push(...doc.document_passage_matches);
        }
      });
    });
  }

  const [passageIndex, setPassageIndex] = useState(null);

  return (
    <Layout title={document.name}>
      <section className="mb-8 flex-1 flex flex-col">
        <DocumentHead document={document} />
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
      </section>
    </Layout>
  );
};

export default DocumentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params.id;
  const client = new ApiClient(process.env.API_URL);

  let documentData: any;

  try {
    const { data: returnedData } = await client.get(`/documents/${id}`, null);
    documentData = returnedData;
  } catch {
    // TODO: Handle error more gracefully
  }

  if (!documentData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      document: documentData,
    },
  };
};
