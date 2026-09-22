import { LandingPage } from "@/components/organisms/LandingPage";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TLandingPageConfig } from "@/types";

export default function NatureLandingPage() {
  const landingPageConfig: TLandingPageConfig = {
    hero: {
      taxonomy: "Data library",
      title: "Nature Policy Library",
      description: "National laws and policies shaping how countries tackle biodiversity loss",
    },
    search: {
      button: {
        label: "Search Nature laws and policies",
        // TODO: Remove this, old search does not support domain::Nature
        params: {
          [QUERY_PARAMS.query_string]: "Nature",
        },
        newParams: {
          [QUERY_PARAMS.filters]: JSON.stringify({
            op: "and",
            filters: [{ field: "labels.value.id", op: "contains", value: "domain::Nature" }],
          }),
        },
      },
      suggestions: [
        {
          label: "Deforestation targets",
          params: {
            [QUERY_PARAMS.query_string]: "Deforestation targets",
          },
          newParams: {
            [QUERY_PARAMS.query_string]: "Deforestation targets",
          },
        },
        {
          label: "Marine spatial planning",
          params: {
            [QUERY_PARAMS.query_string]: "Marine spatial planning",
          },
          newParams: {
            [QUERY_PARAMS.query_string]: "Marine spatial planning",
          },
        },
        {
          label: "Freshwater adaptation in South Asia",
          params: {
            [QUERY_PARAMS.query_string]: "Freshwater adaptation in South Asia",
          },
          newParams: {
            [QUERY_PARAMS.query_string]: "Freshwater adaptation in South Asia",
          },
        },
      ],
    },
    textContent: [
      {
        title: "About",
        content: (
          <>
            <p>
              The Nature Policy Library brings together over 3000 national laws and policies that document how countries are implementing the{" "}
              <a href="https://www.cbd.int/gbf">Kunming-Montreal Global Biodiversity Framework</a>. Nature-based solutions – actions that work with
              nature to address wider challenges, including climate change – are a particular area of interest. To be included, documents must be
              motivated by biodiversity or nature concerns, be a national environmental framework law (e.g. Environment Act), or govern a priority
              sector (e.g. forestry, agriculture) – and must carry legal force or set out a current policy objective.
            </p>
            <p>
              This is a first step, not a comprehensive picture. Coverage currently builds on the approach we have developed for climate policy,
              alongside new additions sourced specifically for this collection. We will continue to broaden both coverage and scope, and we welcome
              collaboration, contributions, and feedback – get in touch:{" "}
              <a href="mailto:nature@climatepolicyradar.org">nature@climatepolicyradar.org</a>
            </p>
          </>
        ),
      },
      {
        title: "Methodology",
        content: (
          <>
            <p className="mb-4">
              This library is powered by Climate Policy Radar, turning documents from every country into searchable, accessible, and useful
              information.
            </p>
            <p className="mb-4">
              We build and train models that can automatically read and extract text from PDFs and websites, enabling us to structure and share
              information from thousands of documents.
            </p>
            <ul className="list-disc pl-5">
              <li>Trained on expert-built, topic-relevant knowledge</li>
              <li>Reviewed and improved by researchers and policy professionals</li>
              <li>Transparent, multilingual, and auditable by design</li>
            </ul>
          </>
        ),
      },
    ],
    requiredFeature: "themes",
  };
  return <LandingPage config={landingPageConfig} />;
}
