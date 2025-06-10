import { useRouter } from "next/router";
import { useContext } from "react";

import { Icon } from "@/components/atoms/icon/Icon";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { ThemePageFeaturesContext } from "@/context/ThemePageFeaturesContext";
import { isKnowledgeGraphEnabled } from "@/utils/features";

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
      [QUERY_PARAMS.concept_name]: "Zoning and spatial planning",
      [QUERY_PARAMS.query_string]: "marine",
      [QUERY_PARAMS.exact_match]: "true",
    },
  },
  {
    id: 4,
    label: "Emissions reductions targets + Climate framework laws",
    params: {
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.framework_laws]: "true",
      [QUERY_PARAMS.concept_name]: "Emissions reduction target",
    },
  },
];

const LandingPageLinks = ({}) => {
  const router = useRouter();
  const { featureFlags, themeConfig } = useContext(ThemePageFeaturesContext);
  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);

  const handleQuickSearch = (params: Record<string, string>) => {
    // Push directly to search page with all parameters
    router.push({
      pathname: "/search",
      query: params,
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
