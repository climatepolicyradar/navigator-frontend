import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ApiClient } from "@api/http-common";
import { DocumentHead } from "@components/document/DocumentHead";
import Layout from "@components/layouts/Main";
import EmbeddedPDF from "@components/EmbeddedPDF";
import PassageMatches from "@components/PassageMatches";

const DocumentPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ document }) => {
  const [passageIndex, setPassageIndex] = useState(null);

  return (
    <Layout title={document.title}>
      <section className="mb-8 flex-1 flex flex-col">
        <DocumentHead document={document} />
        <section className="mt-4 flex-1 flex">
          <div className="container flex-1 md:flex md:flex-row md:flex-wrap">
            <div className="w-full pb-4 border-b border-lineBorder">
              <h3>Document matches for 'Adaptation Report' (9)</h3>
            </div>
            <div className="md:block md:w-1/3 overflow-y-scroll max-h-[30vh] md:max-h-[80vh]">
              <PassageMatches document={document.physical_document} setPassageIndex={setPassageIndex} activeIndex={passageIndex} />
            </div>
            <div className="md:block md:w-2/3 mt-4 px-6 flex-1 h-[400px] md:h-auto">
              <EmbeddedPDF document={document.physical_document} passageIndex={passageIndex} />
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

  return {
    props: {
      document: {
        ...document,
        title: "Regulation 2020/2220 of the European Parliament and of the Council",
        variant: { id: 1, label: "(EN) official translation", description: "" },
        physical_document: {
          document_name: "National Climate Adaptation Strategy",
          document_geography: "NLD",
          document_sectors: [],
          document_source: "CCLW",
          document_date: "01/12/2016",
          document_id: "CCLW.executive.8708.1447",
          document_slug: "netherlands_2016_national-climate-adaptation-strategy_8708_1447",
          document_description:
            "This National Climate Adaptation Strategy introduces various new initiatives and will accelerate the progress of ongoing initiatives in the Netherlands.  The NAS uses four diagrams ('Hotter', 'Wetter', 'Drier' and 'Rising Sea Level') to visualise the effects of climate change within nine sectors: water and spatial management; nature; agriculture, horticulture and fisheries; health and welfare; recreation and tourism; infrastructure (road, rail, water and aviation); energy; IT and telecommunications; public safety and security.  Six climate effects which call for immediate action are identified: 1) Greater heat stress leading to increased morbidity, hospital admissions and mortality, as well as reduced productivity, 2) More frequent failure of vital systems: energy, telecommunications, IT and transport infrastructures, 3) More frequent crop failures or other problems in the agricultural sector, such as decreased yields or damage to production resources, 4) Shifting climate zones whereby some flora and fauna species will be unable to migrate or adapt, due in part to the lack of an internationally coordinated spatial policy, 5) Greater health burden and loss of productivity due to possible increase in infectious diseases or allergic (respiratory) conditions such as hay fever, and 6) Cumulative effects whereby a systems failure in one sector or at one location triggers further problems elsewhere.",
          document_type: "Strategy",
          document_category: "Policy",
          document_source_url:
            "https://climate-laws.org/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdDhGIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--94937f4568971c5912a12874baf91ac6f912f351/f",
          document_url: "https://cdn.climatepolicyradar.org/NLD/2016/national-climate-adaptation-strategy_24f27bf84b960446b6229adcdb817fd0.pdf",
          document_content_type: "application/pdf",
          document_title_match: true,
          document_description_match: false,
          document_passage_matches: [
            {
              text: "2016: Publication of the National Climate\nAdaptation Strategy (NAS).",
              text_block_id: "p_8_b_14",
              text_block_page: 9,
              text_block_coords: [
                [372.1291809082031, 139.65655517578125],
                [553.5045166015625, 139.65655517578125],
                [553.5045166015625, 168.20892333984375],
                [372.1291809082031, 168.20892333984375],
              ],
            },
            {
              text: "National Climate Adaptation Strategy\nClimate trends\neffects at a glance",
              text_block_id: "p_17_b_0",
              text_block_page: 18,
              text_block_coords: [
                [902.2066040039062, 595.9035949707031],
                [1117.082763671875, 595.9035949707031],
                [1117.082763671875, 650.6646118164062],
                [902.2066040039062, 650.6646118164062],
              ],
            },
            {
              text: "National Climate Adaptation Strategy\nClimate trends\neffects at a glance",
              text_block_id: "p_21_b_0",
              text_block_page: 22,
              text_block_coords: [
                [905.4502563476562, 597.7380981445312],
                [1117.785400390625, 597.7380981445312],
                [1117.785400390625, 650.3662719726562],
                [905.4502563476562, 650.3662719726562],
              ],
            },
            {
              text: "2007: Publication of the first National\nClimate Adaptation Strategy. Preparations\nfor the 'Knowledge for Climate' research\nprogramme.",
              text_block_id: "p_8_b_2",
              text_block_page: 9,
              text_block_coords: [
                [33.644554138183594, 248.03765869140625],
                [213.17510986328125, 248.03765869140625],
                [213.17510986328125, 299.2659912109375],
                [33.644554138183594, 299.2659912109375],
              ],
            },
            {
              text: "National Climate Adaptation Strategy\nClimate trends\neffects at a glance",
              text_block_id: "p_19_b_0",
              text_block_page: 20,
              text_block_coords: [
                [904.5955200195312, 597.2102355957031],
                [1117.074951171875, 597.2102355957031],
                [1117.074951171875, 648.8833923339844],
                [904.5955200195312, 648.8833923339844],
              ],
            },
            {
              text: "The negative effects of climate change must be minimized or at least made manageable.\nThose effects include damage to property, nuisance or inconvenience, disease, increased\nmortality and a decline in environmental and ecological quality. This National Climate\nAdaptation Strategy (NAS) introduces various new initiatives and will accelerate the progress\nof ongoing initiatives. It builds upon a decade of climate adaptation policy and, in\ncombination with the Delta Programme, sets out the Netherlands' response to climate\nchange. One important component of the strategy is the desire to unite all parties in\npursuing common objectives. The NAS answers the European Commission's request for\nmember states to produce a climate adaptation strategy no later than 2017.",
              text_block_id: "p_5_b_4",
              text_block_page: 6,
              text_block_coords: [
                [204.1973419189453, 560.5449829101562],
                [554.3527221679688, 560.5449829101562],
                [554.3527221679688, 670.6454925537109],
                [204.1973419189453, 670.6454925537109],
              ],
            },
            {
              text: "1. increase awareness of the necessity of climate adaptation\n2. encourage the implementation of climate adaptation measures\n3. develop and exploit the knowledge base\n4. address urgent climate risks\n5. embed climate adaptation within policy and legislation\n6. monitor the progress and effectiveness of the adaptation strategy.",
              text_block_id: "p_6_b_5",
              text_block_page: 7,
              text_block_coords: [
                [203.23748779296875, 585.0411071777344],
                [478.6129455566406, 585.0411071777344],
                [478.6129455566406, 659.7920379638672],
                [203.23748779296875, 659.7920379638672],
              ],
            },
            {
              text: "1. increase awareness of the necessity of climate adaptation\n2. encourage the implementation of climate adaptation measures\n3. develop and exploit the knowledge base\n4. address urgent climate risks\n5. embed climate adaptation within policy and legislation\n6. monitor the progress and effectiveness of the adaptation strategy.",
              text_block_id: "p_33_b_5",
              text_block_page: 34,
              text_block_coords: [
                [202.74961853027344, 525.294189453125],
                [480.4253845214844, 525.294189453125],
                [480.4253845214844, 599.3109436035156],
                [202.74961853027344, 599.3109436035156],
              ],
            },
            {
              text: "This National Climate Adaptation Strategy forms the precursor of a Climate Adaptation\nImplementation Programme which will build upon the various activities already in\nprogress, such as those of the Delta Programme. The necessary manpower and financial\nresources must now be put in place. The Delta Programme supports the implementation of\nthe NAS in various ways, including the production of the Delta Plan for Spatial Adaptation.\nThis will set out how the various parties are to pursue the objectives of the Delta Decision\non Spatial Adaptation, establishing the instruments and measures required to achieve the\nintended transition. The Climate Adaptation Implementation Programme will continue to\nbe considered in relationship to the Delta Programme.",
              text_block_id: "p_42_b_6",
              text_block_page: 43,
              text_block_coords: [
                [202.63389587402344, 524.3970031738281],
                [558.333984375, 524.3970031738281],
                [558.333984375, 635.0974578857422],
                [202.63389587402344, 635.0974578857422],
              ],
            },
          ],
          document_postfix: "",
        },
      },
    },
  };
};
