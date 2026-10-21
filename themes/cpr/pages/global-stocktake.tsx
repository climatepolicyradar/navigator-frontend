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
      title: "Global Stocktake",
      description: "Search submissions to the UNFCCC Global Stocktake from parties and non-Party stakeholders.",
    },
    search: {
      button: {
        label: "Search Global Stocktake submissions",
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
              The Global Stocktake is the process by which countries and other stakeholders take stock of collective progress towards the goals of the
              Paris Agreement. It repeats every five years, and each cycle produces a large body of submitted evidence.
            </p>
            <p className="mb-4">
              This library brings those submissions together so they can be searched in full text, alongside the rest of the climate policy record.
              Submissions come from parties to the agreement and from non-Party stakeholders such as research institutions, civil society and industry
              groups.
            </p>
            <p className="mb-4">
              Every document currently in this library was submitted to the first Global Stocktake (GST1), and the searches above are scoped to that
              cycle. You can clear the GST1 filter on the search page at any time to look across every stocktake in the library.
            </p>
          </>
        ),
      },
    ],
    requiredFeature: "climate-cop31-2026",
  };
  return <LandingPage config={landingPageConfig} />;
}
