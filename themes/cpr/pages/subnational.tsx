import { LandingPage } from "@/components/organisms/LandingPage";
import { ID_SEPARATOR } from "@/constants/chars";
import { SUBNATIONAL_LABEL_TYPE } from "@/constants/labels";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TLandingPageConfig, TSearchQueryRule } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";

// Scopes searches to subnational geographies. Shared by the search button and
// every suggestion so the three cannot drift apart.
//
// This is an artificial label: queryGroupToAPIFilters rewrites it into a
// `labels.value.type contains subdivision` rule when the search request is
// built (see LABEL_SEARCH_REPLACEMENTS). Filtering on labels.value.type here
// directly would not survive the URL parser, whose schema only permits
// labels.value.id and attributes.published_date.
const SUBNATIONAL_FILTER: TSearchQueryRule = {
  field: "labels.value.id",
  op: "contains",
  value: [SUBNATIONAL_LABEL_TYPE, "Subdivision"].join(ID_SEPARATOR),
  checked: true,
};

export default function NatureLandingPage() {
  const landingPageConfig: TLandingPageConfig = {
    hero: {
      taxonomy: "Data library",
      title: "Subnational Policy Library",
      description: "Search for climate laws, plans, and policies from states and regions around the world.",
    },
    heroImage: {
      src: "/images/subnational/subnational-hero.png",
    },
    partners: {
      title: "The documents in this library have been kindly provided by organisations working at the forefront of subnational climate action:",
      logos: [
        { src: "/images/subnational/logo-under2.png", alt: "Under2 Coalition", width: 164, height: 96 },
        { src: "/images/subnational/logo-polea.png", alt: "Polea, Política y Legislación Ambiental", width: 222, height: 96 },
        { src: "/images/subnational/logo-scetti.png", alt: "Scetti, State Clean Electricity Transition Tracker India", width: 252, height: 96 },
        { src: "/images/subnational/logo-gri.png", alt: "Grantham Research Institute on Climate Change and the Environment", width: 314, height: 96 },
        { src: "/images/subnational/logo-laclima.png", alt: "LACLIMA", width: 160, height: 96 },
        { src: "/images/subnational/logo-juma.png", alt: "Juma", width: 96, height: 96 },
      ],
    },
    search: {
      button: {
        label: "Search subnational laws and policies",
        params: {
          [QUERY_PARAMS.sort_order]: "desc",
          [QUERY_PARAMS.query_string]: "",
        },
        newParams: {
          [QUERY_PARAMS.filters]: deflateFilters({
            op: "and",
            filters: [SUBNATIONAL_FILTER],
          }),
        },
      },
      suggestions: [
        {
          label: "See the latest",
          params: {
            [QUERY_PARAMS.sort_order]: "desc",
          },
          newParams: {
            [QUERY_PARAMS.sort]: "recent",
            [QUERY_PARAMS.filters]: deflateFilters({
              op: "and",
              filters: [SUBNATIONAL_FILTER],
            }),
          },
        },
        {
          label: "Indigenous Peoples in Brazilian states",
          params: {
            [QUERY_PARAMS.country]: "brazil",
            [QUERY_PARAMS.concept_name]: "indigenous people",
          },
          newParams: {
            [QUERY_PARAMS.filters]: deflateFilters({
              op: "and",
              filters: [
                SUBNATIONAL_FILTER,
                {
                  op: "or",
                  filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q684", checked: true }],
                },
                {
                  op: "and",
                  filters: [
                    { field: "labels.value.id", op: "contains", value: "region::LCN" },
                    {
                      op: "or",
                      filters: [{ field: "labels.value.id", op: "contains", value: "country::BRA", checked: true }],
                    },
                  ],
                },
              ],
            }),
          },
        },
        {
          label: "Infrastructure & settlements adaptation",
          params: {
            [QUERY_PARAMS.concept_name]: "infrastructure and settlements adaptation",
          },
          newParams: {
            [QUERY_PARAMS.filters]: deflateFilters({
              op: "and",
              filters: [
                SUBNATIONAL_FILTER,
                {
                  op: "or",
                  filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q1834", checked: true }],
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
              Subnational actors are at the forefront of climate action. Legislators in their own right, states and regions play a crucial role in
              delivering national and global climate goals. Subnational governments are a source of implementation knowledge and best practice that
              can be adapted and applied across multiple contexts.
            </p>
            <p className="mb-4">
              The Subnational Policy Library brings together policies, action plans, and laws from over 130 states and regions across the world.
              Search the full text of every document to discover how subnational governments are taking action to address climate change.{" "}
            </p>
            <p className="mb-4">
              The dataset will grow over time to include more states and regions. If you cannot find a policy, plan, or law for a particular state or
              region, this does not mean it does not exist. For more on the scope of documents included, see our{" "}
              <a href="https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md">methodology page</a>. If you come across any
              documents missing, <a href="https://form.jotform.com/233294135296359">please get in touch</a>.
            </p>
          </>
        ),
      },
    ],
    requiredFeature: "themes",
  };
  return <LandingPage config={landingPageConfig} />;
}
