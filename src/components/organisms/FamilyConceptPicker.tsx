import { TextSearch } from "lucide-react";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { Accordion } from "@/components/accordion/Accordion";
import { Badge } from "@/components/atoms/label/Badge";
import { InputCheck } from "@/components/forms/Checkbox";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TConcept } from "@/types";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { firstCase } from "@/utils/text";

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

const onConceptChange = (router: NextRouter, concept: TConcept) => {
  const query = CleanRouterQuery({ ...router.query });
  // Retain any dynamic ids in the query (e.g. document page)
  if (router.query.id) {
    query["id"] = router.query.id;
  }
  let selectedConcepts = query[QUERY_PARAMS.concept_preferred_label] ? [query[QUERY_PARAMS.concept_preferred_label]].flat() : [];

  const selectedConceptLabel = concept.wikibase_id;
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
  const [rootConcepts, setRootConcepts] = useState<TConcept[]>([]);
  const [conceptsGrouped, setConceptsGrouped] = useState<{
    [rootConceptId: string]: TConcept[];
  }>({});

  useEffect(() => {
    const rootConcepts = concepts.filter((concept) => concept.recursive_subconcept_of.length === 0);
    setRootConcepts(rootConcepts);
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
        </div>
        <div className={`flex flex-col text-sm border-t border-border-light`}>
          {rootConcepts.map((rootConcept, rootConceptIndex) => {
            const filteredConcepts = filterConcepts(conceptsGrouped[rootConcept.wikibase_id] || [], search);
            if (filteredConcepts.length === 0) return null;
            return (
              <Accordion
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
                        checked={isSelected(router.query[QUERY_PARAMS.concept_preferred_label], concept.wikibase_id)}
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

          <div className="h-[34px] sticky block bottom-0 w-full bg-gradient-to-b from-transparent to-white">&nbsp;</div>
        </div>
      </div>
    </div>
  );
};
