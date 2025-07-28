import { TextSearch } from "lucide-react";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { Accordian } from "@/components/accordian/Accordian";
import { Badge } from "@/components/atoms/label/Badge";
import { Select } from "@/components/atoms/select/Select";
import { InputCheck } from "@/components/forms/Checkbox";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { IConcept } from "@/types";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { firstCase } from "@/utils/text";

interface IProps {
  concepts: IConcept[];
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

const conceptsSorter = (a: IConcept, b: IConcept, sort: TSort) => {
  if (sort === "A-Z") {
    return a.preferred_label.localeCompare(b.preferred_label);
  } else if (sort === "Grouped") {
    return a.recursive_subconcept_of[0].localeCompare(b.recursive_subconcept_of[0]);
  }
  return 0;
};

const filterConcepts = (concepts: IConcept[], search: string) => {
  return concepts.filter(
    (concept) =>
      concept.preferred_label.toLowerCase().includes(search.toLowerCase()) ||
      concept.alternative_labels.some((label) => label.toLowerCase().includes(search.toLowerCase()))
  );
};

const getHierarchicalConceptLabel = (concept: IConcept) => {
  return `${concept.type}/${concept.preferred_label}`;
};

const onConceptChange = (router: NextRouter, concept: IConcept) => {
  const query = CleanRouterQuery({ ...router.query });
  // Retain any dynamic ids in the query (e.g. document page)
  if (router.query.id) {
    query["id"] = router.query.id;
  }
  let selectedConcepts = query[QUERY_PARAMS.concept_preferred_label] ? [query[QUERY_PARAMS.concept_preferred_label]].flat() : [];

  const selectedConceptLabel = getHierarchicalConceptLabel(concept);
  if (selectedConcepts.includes(selectedConceptLabel)) {
    selectedConcepts = selectedConcepts.filter((c) => c !== selectedConceptLabel);
  } else {
    selectedConcepts = [...selectedConcepts, selectedConceptLabel];
  }

  query[QUERY_PARAMS.concept_preferred_label] = selectedConcepts;

  router.push({ query: query }, undefined, { shallow: true });
};

export const FamilyConceptPicker = ({
  concepts,
  containerClasses = "",
  startingSort = "Grouped",
  showBadge = false,
  showSearch = true,
  title,
}: IProps) => {
  const router = useRouter();
  const ref = useRef(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<TSort>(startingSort);
  const [rootConcepts, setRootConcepts] = useState<IConcept[]>([]);
  const [conceptsGrouped, setConceptsGrouped] = useState<{
    [rootConceptId: string]: IConcept[];
  }>({});
  const [filteredConcepts, setFilteredConcepts] = useState<IConcept[]>([]);

  const selectOptions = SORT_OPTIONS.map((option) => ({
    value: option,
    label: option,
  }));

  useEffect(() => {
    const rootConcepts = concepts.filter((concept) => concept.recursive_subconcept_of.length === 0);
    setRootConcepts(rootConcepts);
    setFilteredConcepts(concepts);
    setConceptsGrouped(groupByRootConcept(concepts, rootConcepts));
  }, [concepts]);

  return (
    <div className={`relative flex flex-col gap-5 max-h-full pb-5 ${containerClasses}`} ref={ref}>
      {/* HEADER */}
      <span className="text-base font-semibold text-text-primary">
        <TextSearch size={20} className="inline mr-2 text-text-brand align-text-bottom" />
        {title}
        {showBadge && <Badge className="ml-2">Beta</Badge>}
      </span>

      {/* SCROLL AREA */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto scrollbar-thumb-scrollbar scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-scrollbar-darker">
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

              return (
                <Accordian
                  title={firstCase(rootConcept.preferred_label)}
                  key={rootConcept.wikibase_id + rootConceptIndex}
                  fixedHeight="100%"
                  startOpen={true}
                  open={search === "" ? undefined : true}
                  className="py-3 border-b border-border-lighter"
                >
                  <div className="flex flex-col gap-2 pb-2">
                    {filteredConcepts
                      .sort((a, b) => conceptsSorter(a, b, "A-Z"))
                      .map((concept, i) => (
                        <InputCheck
                          key={concept.wikibase_id + i}
                          label={firstCase(concept.preferred_label)}
                          checked={isSelected(router.query[QUERY_PARAMS.concept_preferred_label], getHierarchicalConceptLabel(concept))}
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
                  checked={isSelected(router.query[QUERY_PARAMS.concept_preferred_label], concept.preferred_label)}
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
