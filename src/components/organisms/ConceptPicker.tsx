import { TextSearch } from "lucide-react";
import { NextRouter, useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { Accordion } from "@/components/accordion/Accordion";
import { Badge } from "@/components/atoms/badge/Badge";
import { Select } from "@/components/atoms/select/Select";
import { InputCheck } from "@/components/forms/Checkbox";
import { TutorialCard } from "@/components/molecules/tutorials/TutorialCard";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TUTORIALS } from "@/constants/tutorials";
import { FeaturesContext } from "@/context/FeaturesContext";
import { ThemeContext } from "@/context/ThemeContext";
import { TutorialContext } from "@/context/TutorialContext";
import { TConcept, TTheme } from "@/types";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { fetchAndProcessConcepts } from "@/utils/fetchAndProcessConcepts";
import { firstCase } from "@/utils/text";
import { getIncompleteTutorialNames } from "@/utils/tutorials";

interface IProps {
  concepts: TConcept[];
  containerClasses?: string;
  showBadge?: boolean;
  showSearch?: boolean;
  startingSort?: TSort;
  title: string;
}

const SORT_OPTIONS = ["A-Z", "Grouped"] as const;

type TSort = (typeof SORT_OPTIONS)[number];

const isSelected = (queryValue: string | string[] | undefined, option: string) => {
  if (!queryValue) {
    return false;
  }
  if (typeof queryValue === "string") {
    return queryValue === option;
  } else {
    return queryValue.includes(option);
  }
};

const conceptsSorter = (a: TConcept, b: TConcept, sort: TSort) => {
  if (sort === "A-Z") {
    return a.preferred_label.localeCompare(b.preferred_label);
  } else if (sort === "Grouped") {
    return a.recursive_subconcept_of[0].localeCompare(b.recursive_subconcept_of[0]);
  }
  return 0;
};

const filterConcepts = (concepts: TConcept[], search: string) => {
  return concepts.filter(
    (concept) =>
      concept.preferred_label.toLowerCase().includes(search.toLowerCase()) ||
      concept.alternative_labels.some((label) => label.toLowerCase().includes(search.toLowerCase()))
  );
};

const removeUnusableConcepts = (concepts: TConcept[], theme: TTheme): TConcept[] => {
  if (theme !== "mcf") return concepts;

  const CLIMATE_FINANCE = "Q1343";
  return concepts.filter((concept) => concept.wikibase_id !== CLIMATE_FINANCE && !concept.recursive_subconcept_of?.includes(CLIMATE_FINANCE));
};

const onConceptChange = (router: NextRouter, concept: TConcept) => {
  const query = CleanRouterQuery({ ...router.query });
  // Retain any dynamic ids in the query (e.g. document page)
  if (router.query.id) {
    query["id"] = router.query.id;
  }
  let selectedConcepts = query[QUERY_PARAMS.concept_name] ? [query[QUERY_PARAMS.concept_name]].flat() : [];

  if (selectedConcepts.includes(concept.preferred_label)) {
    selectedConcepts = selectedConcepts.filter((c) => c !== concept.preferred_label);
  } else {
    selectedConcepts = [...selectedConcepts, concept.preferred_label];
  }

  query[QUERY_PARAMS.concept_name] = selectedConcepts;

  router.push({ query: query }, undefined, { shallow: true });
};

export const ConceptPicker = ({ concepts, containerClasses = "", startingSort = "Grouped", showBadge = false, showSearch = true, title }: IProps) => {
  const router = useRouter();
  const { completedTutorials } = useContext(TutorialContext);
  const { theme, themeConfig } = useContext(ThemeContext);
  const features = useContext(FeaturesContext);
  const ref = useRef(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<TSort>(startingSort);
  const [rootConcepts, setRootConcepts] = useState<TConcept[]>([]);
  const [conceptsGrouped, setConceptsGrouped] = useState<{
    [rootConceptId: string]: TConcept[];
  }>({});
  const [filteredConcepts, setFilteredConcepts] = useState<TConcept[]>([]);

  const selectOptions = SORT_OPTIONS.map((option) => ({
    value: option,
    label: option,
  }));

  useEffect(() => {
    const conceptIds = concepts.map((concept) => concept.wikibase_id);
    fetchAndProcessConcepts(conceptIds).then(({ rootConcepts, concepts }) => {
      // TECH DEBT: Remove climate finance concepts from MCF as they don't currently work as expected
      const usableRootConcepts = removeUnusableConcepts(rootConcepts, theme);
      const usableConcepts = removeUnusableConcepts(concepts, theme);

      setRootConcepts(usableRootConcepts);
      setFilteredConcepts(usableConcepts);
      setConceptsGrouped(groupByRootConcept(usableConcepts, usableRootConcepts));
    });
  }, [concepts, theme]);

  const showKnowledgeGraphTutorial = getIncompleteTutorialNames(completedTutorials, themeConfig, features).includes("knowledgeGraph");

  return (
    <div className={`relative flex flex-col gap-5 max-h-full pb-5 ${containerClasses}`} ref={ref}>
      {/* HEADER */}
      {showKnowledgeGraphTutorial && <TutorialCard name="knowledgeGraph" card={TUTORIALS.knowledgeGraph.card} />}
      <span className="text-base font-semibold text-text-primary">
        <TextSearch size={20} className="inline mr-2 text-text-brand align-text-bottom" />
        {title}
        {!showKnowledgeGraphTutorial && showBadge && <Badge className="ml-2">Beta</Badge>}
      </span>

      {/* SCROLL AREA */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto scrollbar-thumb-scrollbar scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-scrollbar-darker">
        {!showKnowledgeGraphTutorial && (
          <p className="text-sm text-text-tertiary">
            Choose a topic to see precisely where it appears. Combine topics to see where they appear together. Accuracy is not 100%.{" "}
            <ExternalLink url="/faq#topics-faqs" className="underline inline-block">
              Learn more
            </ExternalLink>
          </p>
        )}
        <div className="flex gap-2 items-center justify-between">
          {showSearch && (
            <input
              type="text"
              placeholder="Quick search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="py-1 text-xs h-[30px]"
            />
          )}
          <div className="basis-3/10 shrink-0 relative flex items-center">
            <label className="text-sm text-text-tertiary">Sort:</label>
            <Select
              defaultValue="A-Z"
              value={sort}
              onValueChange={(value) => setSort(value as TSort)}
              options={selectOptions}
              container={ref.current}
            />
          </div>
        </div>
        {search !== "" && <p className="text-xs italic">The results below are also filtered using the topic's alternative labels</p>}
        <div className={`flex flex-col text-sm border-t border-border-light ${sort === "A-Z" ? "gap-2 border-t-0" : ""}`}>
          {/* GROUPED SORT */}
          {sort === "Grouped" &&
            rootConcepts.map((rootConcept, rootConceptIndex) => {
              const filteredConcepts = filterConcepts(conceptsGrouped[rootConcept.wikibase_id] || [], search);
              if (filteredConcepts.length === 0) return null;
              // Starts open if:
              // - any of the concepts in the root concept are selected
              // OR
              // - it is the first root concept
              const startOpen =
                filteredConcepts.some((concept) => isSelected(router.query[QUERY_PARAMS.concept_name], concept.preferred_label)) ||
                rootConceptIndex === 0;
              return (
                <Accordion
                  title={firstCase(rootConcept.preferred_label)}
                  key={rootConcept.wikibase_id}
                  fixedHeight="100%"
                  startOpen={startOpen}
                  open={search === "" ? undefined : true}
                  className="py-3 border-b border-border-lighter"
                >
                  <div className="flex flex-col gap-2 pb-2">
                    {filteredConcepts
                      .sort((a, b) => conceptsSorter(a, b, "A-Z"))
                      .map((concept) => (
                        <InputCheck
                          key={concept.wikibase_id}
                          label={firstCase(concept.preferred_label)}
                          checked={isSelected(router.query[QUERY_PARAMS.concept_name], concept.preferred_label)}
                          onChange={() => {
                            onConceptChange(router, concept);
                          }}
                          name={concept.preferred_label}
                        />
                      ))}
                  </div>
                </Accordion>
              );
            })}

          {/* A-Z SORT */}
          {sort === "A-Z" &&
            filterConcepts(filteredConcepts, search)
              .sort((a, b) => conceptsSorter(a, b, sort))
              .map((concept) => (
                <InputCheck
                  key={concept.wikibase_id}
                  label={firstCase(concept.preferred_label)}
                  checked={isSelected(router.query[QUERY_PARAMS.concept_name], concept.preferred_label)}
                  onChange={() => {
                    onConceptChange(router, concept);
                  }}
                  name={concept.preferred_label}
                />
              ))}

          <div className="h-[34px] sticky block bottom-0 w-full bg-gradient-to-b from-transparent to-white">&nbsp;</div>
        </div>
      </div>
    </div>
  );
};
