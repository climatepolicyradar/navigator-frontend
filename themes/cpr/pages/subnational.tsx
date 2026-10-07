import { LandingPage } from "@/components/organisms/LandingPage";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TLandingPageConfig } from "@/types";

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
      logos: [],
    },
    search: {
      button: {
        label: "Search subnational laws and policies",
        // TODO: Remove this, old search does not support domain::Nature
        params: {
          [QUERY_PARAMS.sort_order]: "desc",
          [QUERY_PARAMS.query_string]: "",
        },
        newParams: {
          [QUERY_PARAMS.sort]: "recent",
          [QUERY_PARAMS.filters]: JSON.stringify({
            op: "and",
            filters: [
              {
                field: "labels.value.type",
                op: "contains",
                value: "country",
                checked: true,
              },
              {
                field: "labels.value.type",
                op: "not_contains",
                value: "subdivision",
                checked: true,
              },
            ],
          }),
        },
      },
      suggestions: [],
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
