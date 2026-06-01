import { LandingPage, TLandingPageConfig } from "@/components/organisms/LandingPage";
import { QUERY_PARAMS } from "@/constants/queryParams";

export default function ICCNLandingPage() {
  const landingPageConfig: TLandingPageConfig = {
    background: {
      classes: "absolute -z-1 top-6 right-0",
      image: {
        src: "/images/iccn/iccn-background.svg",
        alt: "ICCN logo used as a background",
        width: 438,
        height: 435,
      },
    },
    hero: {
      taxonomy: "Data library",
      title: "Climate Council Report Library",
      description: "Progress reports from climate councils around the world",
    },
    organisation: {
      logoImage: {
        src: "/images/iccn/iccn-logo.jpg",
        alt: "ICCN logo",
        width: 722,
        height: 226,
      },
      links: [
        {
          label: "climatecouncils.org",
          externalHref: "https://www.climatecouncils.org/",
        },
        {
          label: "ICCN LinkedIn",
          externalHref: "https://www.linkedin.com/company/international-climate-councils-network/",
        },
        {
          label: "ICCN Newsletter",
          externalHref: "https://www.climatecouncils.org/#newsletter",
        },
      ],
    },
    search: {
      button: {
        label: "Search progress reports",
        query: {
          [QUERY_PARAMS.category]: "Climate Council Reports",
        },
      },
      suggestions: [
        {
          label: "Grid capacity",
          query: {
            [QUERY_PARAMS.category]: "Climate Council Reports",
            [QUERY_PARAMS.query_string]: "Grid capacity",
          },
        },
        {
          label: "Agricultural systems",
          query: {
            [QUERY_PARAMS.category]: "Climate Council Reports",
            [QUERY_PARAMS.query_string]: "Agricultural systems",
          },
        },
        {
          label: "Emissions reductions pathways",
          query: {
            [QUERY_PARAMS.category]: "Climate Council Reports",
            [QUERY_PARAMS.query_string]: "Emissions reductions pathways",
          },
        },
      ],
    },
    textContent: [
      {
        title: "About",
        content: (
          <p>
            A core part of most climate councils’ mandates is to report on their governments’ progress towards climate targets. This library draws on
            climate councils all over the world, from New Zealand, to Canada, Guatemala and South Africa (plus the European Union).
          </p>
        ),
      },
      {
        title: "ICCN",
        content: (
          <>
            <p className="mb-4">
              The International Climate Councils Network (ICCN) was launched in 2021 to support and amplify the work of a growing network of climate
              councils: the expert bodies officially mandated to advise their governments on climate policy.
            </p>
            <p>The ICCN’s mission is to strengthen climate governance through effective climate councils.</p>
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
  };

  return <LandingPage config={landingPageConfig} />;
}
