import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Icon } from "@/components/atoms/icon/Icon";
import { DEFAULT_CONFIG_FEATURES } from "@/constants/features";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TFeatureFlags, TThemeConfig } from "@/types";
import { getAllCookies } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isKnowledgeGraphEnabled } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

const EXAMPLE_SEARCHES = [
  {
    id: 1,
    label: "Adaptation",
    params: {
      [QUERY_PARAMS.query_string]: "Adaptation",
    },
  },
  {
    id: 2,
    label: "Brazil",
    params: {
      [QUERY_PARAMS.country]: "brazil",
    },
  },
  {
    id: 3,
    label: "Climate framework laws",
    params: {
      [QUERY_PARAMS.query_string]: "Climate framework laws",
    },
  },
  {
    id: 4,
    label: "Coastal zones",
    params: {
      [QUERY_PARAMS.query_string]: "Coastal zones",
    },
  },
];

const KNOWLEDGE_GRAPH_QUICK_SEARCHES = [
  {
    id: 1,
    label: "Latest NDCs",
    params: {
      [QUERY_PARAMS.category]: "UNFCCC",
      [QUERY_PARAMS["_document.type"]]: "Nationally Determined Contribution",
      [QUERY_PARAMS.author_type]: "Party",
    },
  },
  {
    id: 2,
    label: "Indigenous people + Brazil + Laws",
    params: {
      [QUERY_PARAMS.country]: "brazil",
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.concept_name]: "indigenous people",
    },
  },
  {
    id: 3,
    label: "Zoning and spatial planning + marine",
    params: {
      [QUERY_PARAMS.concept_name]: "zoning and spatial planning",
      [QUERY_PARAMS.query_string]: "marine",
      [QUERY_PARAMS.exact_match]: "true",
    },
  },
  // {
  //   id: 4,
  //   label: "Emissions reductions targets + Climate framework laws",
  //   params: {
  //     [QUERY_PARAMS.category]: "laws",
  //     [QUERY_PARAMS.framework_laws]: "true",
  //     [QUERY_PARAMS.concept_name]: "emissions reduction target",
  //   },
  // },
  {
    id: 5,
    label: "Climate framework laws",
    params: {
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.framework_laws]: "true",
    },
  },
];

const LandingPageLinks = ({}) => {
  const router = useRouter();

  /*
    The landing page is read in not by using Next.JS, but by our CPR specific page reading logic.
    This means that we cannot fetch the feature flags directly by using the page context.
    This function provides a means of working around this so we can conditionally display the
    quick searches.

    TODO: Remove this once we have hard launched concepts in product.
  */
  const [featureFlags, setFeatureFlags] = useState({} as TFeatureFlags);
  const [localThemeConfig, setLocalThemeConfig] = useState<TThemeConfig>({ features: DEFAULT_CONFIG_FEATURES } as TThemeConfig);

  async function loadConfig() {
    const allCookies = getAllCookies();
    const parsedFeatureFlags = getFeatureFlags(allCookies);
    setFeatureFlags(parsedFeatureFlags);

    const theme = process.env.THEME;
    const themeConfig = await readConfigFile(theme);
    setLocalThemeConfig(themeConfig);
  }

  // TODO: Remove this once we have hard launched concepts in product.
  useEffect(() => {
    loadConfig();
  }, []);

  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, localThemeConfig);

  const handleQuickSearch = (params: Record<string, string>) => {
    // Push directly to search page with all parameters
    router.push({
      pathname: "/search",
      query: {
        ...params,
      },
    });
  };

  const searches = knowledgeGraphEnabled ? KNOWLEDGE_GRAPH_QUICK_SEARCHES : EXAMPLE_SEARCHES;

  return (
    <section>
      <div className="md:flex text-white">
        <div className="md:mr-12">
          <Icon name="eye" />
        </div>
        <div>
          <div className="font-medium text-2xl">Try these searches</div>
          <ul className="text-lg mt-4">
            {searches.map((search) => (
              <li className="my-2" key={search.id}>
                <a
                  className="text-white hover:text-blue-200 hover:underline"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleQuickSearch(search.params);
                  }}
                  data-cy={`quick-search-${search.id}`}
                >
                  {search.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LandingPageLinks;
