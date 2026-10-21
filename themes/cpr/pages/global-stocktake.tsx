import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { LandingPage } from "@/components/organisms/LandingPage";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TLandingPageConfig, TSearchQueryGroup, TSearchQueryRule } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";

// Scopes searches to the Global Stocktake category. Shared by the search button
// and every suggestion so the two cannot drift apart.
const GST_FILTER: TSearchQueryRule = {
  field: "labels.value.id",
  op: "contains",
  value: "category::Global Stocktake",
  checked: true,
};

// Narrows to the first Global Stocktake. This page covers GST1 only, so the
// button and every suggestion carry it and a user following a suggestion lands
// on a GST1-scoped view. When GST2 is added later, this page should be updated to
// stop scoping to GST1, rather than a second page being added alongside it.
//
// Wrapped in an `or` group of one to match how the sidebar builds a selected
// sub-filter, so the search UI shows it ticked and the user can swap cycles.
// Today this does not change the result count (every GST document in the index
// currently is a GST1 submission), but it keeps the scope explicit as GST2 is added.
const GST1_GROUP: TSearchQueryGroup = {
  op: "or",
  filters: [{ field: "labels.value.id", op: "contains", value: "process::GST1", checked: true }],
};

export default function GlobalStocktakeLandingPage() {
  const landingPageConfig: TLandingPageConfig = {
    hero: {
      taxonomy: "Data library",
      title: "Global Stocktake 1 Explorer",
      description: "Explore and analyse all inputs to the first Global Stocktake",
    },
    heroImage: {
      src: "/images/global-stocktake/gst-hero.jpg",
    },
    headerPartner: {
      label: "In partnership with",
      markImage: { src: "/images/global-stocktake/mark-unfccc-white.png", alt: "UNFCCC", width: 80, height: 64 },
    },
    partners: {
      title: "In partnership with",
      logos: [
        {
          src: "/images/global-stocktake/logo-unfccc.png",
          alt: "United Nations Framework Convention on Climate Change",
          width: 860,
          height: 192,
        },
      ],
    },
    search: {
      button: {
        label: "Search submissions to the first Global Stocktake",
        params: {
          [QUERY_PARAMS.sort_order]: "desc",
          [QUERY_PARAMS.query_string]: "",
        },
        newParams: {
          [QUERY_PARAMS.filters]: deflateFilters({
            op: "and",
            filters: [GST_FILTER, GST1_GROUP],
          }),
        },
      },
      suggestions: [
        {
          label: "Submissions on renewable energy",
          params: {
            [QUERY_PARAMS.concept_name]: "renewable energy",
          },
          newParams: {
            [QUERY_PARAMS.filters]: deflateFilters({
              op: "and",
              filters: [
                GST_FILTER,
                GST1_GROUP,
                {
                  op: "or",
                  filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q567", checked: true }],
                },
              ],
            }),
          },
        },
        {
          label: "Europe and Central Asia submissions on fossil fuel subsidy removals",
          params: {
            [QUERY_PARAMS.region]: "europe-central-asia",
            [QUERY_PARAMS.concept_name]: "subsidy removal",
          },
          newParams: {
            [QUERY_PARAMS.filters]: deflateFilters({
              op: "and",
              filters: [
                GST_FILTER,
                GST1_GROUP,
                { field: "labels.value.id", op: "contains", value: "region::ECS", checked: true },
                {
                  op: "and",
                  filters: [
                    { field: "labels.value.id", op: "contains", value: "concept::Q1275", checked: true },
                    { field: "labels.value.id", op: "contains", value: "concept::Q638", checked: true },
                  ],
                },
              ],
            }),
          },
        },
        {
          label: "Adapting health systems to extreme weather in South Asia",
          params: {
            [QUERY_PARAMS.region]: "south-asia",
            [QUERY_PARAMS.concept_name]: "health adaptation",
          },
          newParams: {
            [QUERY_PARAMS.filters]: deflateFilters({
              op: "and",
              filters: [
                GST_FILTER,
                GST1_GROUP,
                { field: "labels.value.id", op: "contains", value: "region::SAS", checked: true },
                {
                  op: "and",
                  filters: [
                    { field: "labels.value.id", op: "contains", value: "concept::Q1833", checked: true },
                    { field: "labels.value.id", op: "contains", value: "concept::Q374", checked: true },
                  ],
                },
              ],
            }),
          },
        },
      ],
    },
    textContent: [
      {
        title: "About",
        content: (
          <>
            <p className="mb-4">
              The first Global Stocktake concluded on 13 December 2023 at the UN climate summit COP28 in Dubai, United Arab Emirates. It was the
              world&apos;s first full assessment of progress towards the goals of the Paris Agreement.{" "}
              <PageLink
                external
                underline
                className="text-text-brand"
                href="https://unfccc.int/topics/global-stocktake/about-the-global-stocktake/outcome-of-the-first-global-stocktake"
              >
                Read the official negotiated outcome
              </PageLink>
              .
            </p>
            <p className="mb-4">
              The Global Stocktake Explorer brings together more than 1,800+ documents and 200,000+ pages. Search the full text of every document,
              with documents in other languages translated into English.
            </p>
            <p className="mb-4">It includes:</p>
            <ul className="mb-4 list-disc pl-5">
              <li>
                <span className="font-medium">Party submissions:</span> NDCs, National Adaptation Plans, long-term strategies (LT-LEDS), Biennial
                Transparency, Update and Biennial Reports, National Communications, National Inventory Reports and Adaptation Communications
              </li>
              <li>
                <span className="font-medium">Non-party inputs:</span> IPCC reports, synthesis and technical analysis reports, submissions to the
                Global Stocktake, Facilitative Sharing of Views and Fast-Start Finance reports
              </li>
            </ul>
            <p className="mb-4">
              Documents are sourced from UNFCCC portals (Global Stocktake Information Portal, NDC Registry, Adaptation Communications Registry, NAP
              Central, TNA Portal), Fast-Start Finance country reports and the IPCC, in line with decision 19/CMA.1 para 37.
            </p>
            <p className="mb-4">Submissions to the second Global Stocktake will be added from early 2027.</p>
          </>
        ),
      },
      {
        title: "Methodology",
        content: (
          <>
            <p className="mb-4">
              This collection is powered by Climate Policy Radar, turning documents from every country into searchable, accessible and useful
              information.
            </p>
            <p className="mb-4">
              We build and train models that automatically read and extract text from PDFs and websites, so we can structure and share information
              from thousands of documents.
            </p>
            <p className="mb-4">The models are:</p>
            <ul className="list-disc pl-5">
              <li>Trained on expert-built, topic-relevant knowledge</li>
              <li>Reviewed and improved by researchers and policy professionals</li>
              <li>Transparent, multilingual, and auditable by design</li>
            </ul>
          </>
        ),
      },
    ],
    requiredFeature: "climate-cop31-2026",
  };
  return <LandingPage config={landingPageConfig} />;
}
