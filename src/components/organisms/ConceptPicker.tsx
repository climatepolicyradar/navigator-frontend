import { NextRouter, useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";

import { Accordian } from "@/components/accordian/Accordian";
import { Badge } from "@/components/atoms/label/Badge";
import { Select } from "@/components/atoms/select/Select";
import { InputCheck } from "@/components/forms/Checkbox";
import { NewFeatureCard } from "@/components/molecules/newFeatures/NewFeatureCard";
import { NEW_FEATURES } from "@/constants/newFeatures";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { TConcept } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";
import { firstCase } from "@/utils/text";

import { LinkWithQuery } from "../LinkWithQuery";

interface IProps {
  concepts: TConcept[];
  containerClasses?: string;
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

const onConceptChange = (router: NextRouter, concept: TConcept) => {
  const query = { ...router.query };
  let selectedConcepts = query[QUERY_PARAMS.concept_name] ? [query[QUERY_PARAMS.concept_name]].flat() : [];

  if (selectedConcepts.includes(concept.preferred_label)) {
    selectedConcepts = selectedConcepts.filter((c) => c !== concept.preferred_label);
  } else {
    selectedConcepts = [...selectedConcepts, concept.preferred_label];
  }

  query[QUERY_PARAMS.concept_name] = selectedConcepts;

  router.push({ query: query }, undefined, { shallow: true });
};

export const ConceptPicker = ({ concepts, containerClasses = "", startingSort = "Grouped", showSearch = true, title }: IProps) => {
  const router = useRouter();
  const { previousNewFeature } = useContext(NewFeatureContext);
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
      setRootConcepts(rootConcepts);
      setFilteredConcepts(concepts);
      setConceptsGrouped(groupByRootConcept(concepts, rootConcepts));
    });
  }, [concepts]);

  const knowledgeGraphIsNew = previousNewFeature < 0;

  return (
    <div className={`relative flex flex-col gap-5 max-h-full pb-5 ${containerClasses}`} ref={ref}>
      {/* HEADER */}
      {knowledgeGraphIsNew && <NewFeatureCard newFeature={NEW_FEATURES[0]} />}
      <span className="text-base font-semibold text-text-primary">
        {title}
        {!knowledgeGraphIsNew && <Badge className="ml-2">Beta</Badge>}
      </span>

      {/* SCROLL AREA */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto scrollbar-thumb-scrollbar scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-scrollbar-darker">
        {!knowledgeGraphIsNew && (
          <p className="text-sm text-text-tertiary">
            Find mentions of topics. Accuracy is not 100%.{" "}
            <LinkWithQuery href="/faq" className="underline" target="_blank">
              Learn more
            </LinkWithQuery>
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
                <Accordian
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
                </Accordian>
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
