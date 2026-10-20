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

// The first Global Stocktake, offered as a sub-filter of the category above.
// `checked` is stripped before the query reaches the API, so it does not narrow
// results -- it ticks the filter in the search sidebar, which is how the user
// sees GST1 is optional and can swap it for GST2 later.
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
          [QUERY_PARAMS.sort]: "recent",
          [QUERY_PARAMS.filters]: deflateFilters({
            op: "and",
            filters: [GST_FILTER],
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
              filters: [GST_FILTER],
            }),
          },
        },
        {
          label: "First Global Stocktake (GST1)",
          params: {
            [QUERY_PARAMS.query_string]: "",
          },
          newParams: {
            [QUERY_PARAMS.filters]: deflateFilters({
              op: "and",
              filters: [GST_FILTER, GST1_GROUP],
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
              Every document currently in this library was submitted to the first Global Stocktake (GST1). You can narrow your search to GST1
              specifically using the suggested search above, which is how you will be able to tell the cycles apart as later stocktakes are added.
            </p>
          </>
        ),
      },
    ],
    requiredFeature: "climate-cop31-2026",
  };
  return <LandingPage config={landingPageConfig} />;
}
