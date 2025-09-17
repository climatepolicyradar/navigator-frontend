import { TextSearch } from "lucide-react";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/atoms/label/Badge";
import { InputCheck } from "@/components/forms/Checkbox";
import { InputRadio } from "@/components/forms/Radio";
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
  isRootConceptExclusive?: boolean;
}

const SORT_OPTIONS = ["A-Z", "Grouped"] as const;

type TSort = (typeof SORT_OPTIONS)[number];

const isSelected = (queryValue: string | string[] | undefined, option: string, parent?: string) => {
  if (!queryValue) {
    return false;
  }
  if (typeof queryValue === "string") {
    return queryValue === option;
  } else {
    // if parent is provided, check if both parent and option are in the query
    if (parent) {
      return queryValue.includes(option) && queryValue.includes(parent);
    } else {
      return queryValue.includes(option);
    }
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

const onConceptChange = (
  router: NextRouter,
  concept: TConcept,
  relatedConcepts: TConcept[],
  rootConcept: TConcept = undefined,
  isRootConceptExclusive: boolean
) => {
  const query = CleanRouterQuery({ ...router.query });
  // Retain any dynamic ids in the query (e.g. document page)
  if (router.query.id) {
    query["id"] = router.query.id;
  }
  let selectedConcepts = query[QUERY_PARAMS.concept_preferred_label] ? [query[QUERY_PARAMS.concept_preferred_label]].flat() : [];

  const selectedConceptLabel = concept.wikibase_id;
  if (selectedConcepts.includes(selectedConceptLabel)) {
    // deselections
    // case 1a: root concept selected, previously selected, remove all child concepts
    if (!rootConcept) {
      selectedConcepts = selectedConcepts.filter((c) => c !== selectedConceptLabel);
      selectedConcepts = selectedConcepts.filter((c) => !relatedConcepts.map((rc) => rc.wikibase_id).includes(c));
    }
    // case 1b: child concept selected, previously selected
    // - check the root concept, if not selected, remove all concepts and reselect root and concept
    if (rootConcept) {
      if (!selectedConcepts.includes(rootConcept.wikibase_id)) {
        selectedConcepts = [rootConcept.wikibase_id, selectedConceptLabel];
      } else {
        selectedConcepts = selectedConcepts.filter((c) => c !== selectedConceptLabel);
      }
    }
  } else {
    // selections
    // case 1a: root concept selected, not previously selected
    // - remove all other concepts
    // if isRootConceptExclusive is false, we allow multiple selections of root and child concepts
    if (!rootConcept) selectedConcepts = isRootConceptExclusive ? [selectedConceptLabel] : [...selectedConcepts, selectedConceptLabel];
    if (rootConcept) {
      const rootConceptLabel = rootConcept?.wikibase_id;
      // case 1b: child concept selected, not previously selected & root concept was selected
      if (selectedConcepts.includes(rootConceptLabel)) {
        selectedConcepts = [...selectedConcepts, selectedConceptLabel];
      } else {
        // case 1c: child concept selected, not previously selected & root concept not selected
        // - remove all other concepts
        // if isRootConceptExclusive is false, we allow multiple selections of root and child concepts
        selectedConcepts = isRootConceptExclusive
          ? [selectedConceptLabel, rootConceptLabel]
          : [...selectedConcepts, selectedConceptLabel, rootConceptLabel];
      }
    }
  }

  query[QUERY_PARAMS.concept_preferred_label] = selectedConcepts;

  router.push({ query: query }, undefined, { shallow: true });
};

/**
 * FamilyConceptPicker component allows users to pick concepts from a grouped family structure.
 * Concepts are grouped by their root concept, and users can search and select/deselect concepts.
 * - concepts: Array of TConcept objects to display.
 * - containerClasses: Optional additional CSS classes for the container.
 * - showBadge: Boolean to show/hide a "Beta" badge next to the title.
 * - showSearch: Boolean to show/hide the search input field.
 * - title: Title of the concept picker.
 * - isRootConceptExclusive: If true, selecting a root concept will deselect all its child concepts and vice versa. (defaults to true)
 */
export const FamilyConceptPicker = ({
  concepts,
  containerClasses = "",
  showBadge = false,
  showSearch = true,
  title,
  isRootConceptExclusive = true,
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
    <div className={`relative flex flex-col max-h-full pb-4 ${containerClasses}`} ref={ref}>
      {/* HEADER */}
      <span className="text-base font-semibold text-text-primary pb-4">
        <TextSearch size={20} className="inline mr-2 text-text-brand align-text-bottom" />
        {title}
        {showBadge && <Badge className="ml-2">Beta</Badge>}
      </span>
      <div className="flex gap-2 items-center justify-between pb-5 border-b border-border-light">
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

      {/* SCROLL AREA */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto scrollbar-thumb-scrollbar scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-scrollbar-darker">
        <div className={`flex flex-col text-sm gap-2 pt-4`}>
          {rootConcepts.map((rootConcept) => {
            const InteractiveComponent = isRootConceptExclusive ? InputRadio : InputCheck;
            const filteredConcepts = filterConcepts(conceptsGrouped[rootConcept.wikibase_id] || [], search);
            if (filteredConcepts.length === 0) return null;
            const childConcepts = filteredConcepts
              .filter((concept) => concept.wikibase_id !== rootConcept.wikibase_id)
              .sort((a, b) => conceptsSorter(a, b, "A-Z"));
            return (
              <div key={rootConcept.wikibase_id}>
                <InteractiveComponent
                  key={rootConcept.wikibase_id}
                  label={firstCase(rootConcept.preferred_label)}
                  checked={isSelected(router.query[QUERY_PARAMS.concept_preferred_label], rootConcept.wikibase_id)}
                  onChange={() => {
                    onConceptChange(router, rootConcept, filteredConcepts, undefined, isRootConceptExclusive);
                  }}
                  onClick={() => {
                    if (isRootConceptExclusive) {
                      onConceptChange(router, rootConcept, filteredConcepts, undefined, isRootConceptExclusive);
                    }
                  }}
                  name={rootConcept.preferred_label}
                  className={
                    childConcepts.some((child) => isSelected(router.query[QUERY_PARAMS.concept_preferred_label], child.wikibase_id)) &&
                    !childConcepts.every((child) => isSelected(router.query[QUERY_PARAMS.concept_preferred_label], child.wikibase_id))
                      ? "semi-checked"
                      : ""
                  }
                />
                {childConcepts.length > 0 && (
                  <div className="pl-8 flex flex-col gap-2 mt-2">
                    {childConcepts.map((concept, i) => (
                      <InputCheck
                        key={concept.wikibase_id + i}
                        label={firstCase(concept.preferred_label)}
                        checked={isSelected(router.query[QUERY_PARAMS.concept_preferred_label], concept.wikibase_id, rootConcept.wikibase_id)}
                        onChange={() => {
                          onConceptChange(router, concept, filteredConcepts, rootConcept, isRootConceptExclusive);
                        }}
                        name={concept.preferred_label}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="h-[34px] sticky block bottom-0 w-full bg-gradient-to-b from-transparent to-white">&nbsp;</div>
        </div>
      </div>
    </div>
  );
};
