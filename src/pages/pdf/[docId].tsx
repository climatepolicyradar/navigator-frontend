import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ApiClient } from "@api/http-common";
import { DocumentHead } from "@components/document/DocumentHead";
import Layout from "@components/layouts/Main";
import EmbeddedPDF from "@components/EmbeddedPDF";
import PassageMatches from "@components/PassageMatches";

import DUMMY_JSON from "./data.json";

const DocumentPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ document }) => {
  const [passageIndex, setPassageIndex] = useState(null);
  const hasPassageMatches = document.physical_document.document_passage_matches.length > 0;

  return (
    <Layout title={document.title}>
      <section className="mb-8 flex-1 flex flex-col">
        <DocumentHead document={document} />
        <section className="mt-4 flex-1 flex">
          <div className="container flex-1">
            <div className="pb-4 border-b border-lineBorder">
              <h3>Document matches for 'Adaptation Report' (9)</h3>
            </div>
            <div className="md:flex md:h-[80vh]">
              {hasPassageMatches && (
                <div className="md:block md:w-1/3 overflow-y-scroll pr-4 max-h-[30vh] md:max-h-full">
                  <PassageMatches document={document.physical_document} setPassageIndex={setPassageIndex} activeIndex={passageIndex} />
                </div>
              )}
              <div className="md:block mt-4 flex-1 h-[400px] md:h-full">
                <EmbeddedPDF document={document.physical_document} passageIndex={passageIndex} />
              </div>
            </div>
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default DocumentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const id = context.params.id;
  const id = "netherlands_2016_national-climate-adaptation-strategy_8708_1447";
  const client = new ApiClient(process.env.API_URL);

  const { data: document } = await client.get(`/documents/${id}`, null);
  const json = DUMMY_JSON;

  return {
    props: {
      document: {
        ...document,
        ...json,
      },
    },
  };
};
