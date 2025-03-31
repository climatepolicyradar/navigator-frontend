import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";

import { Label } from "@/components/labels/Label";
import { InputCheck } from "@/components/forms/Checkbox";
// TODO: proper select box
import { Select } from "@/components/atoms/select/Select";

import { fetchAndProcessConcepts } from "@/utils/processConcepts";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";

import { QUERY_PARAMS } from "@/constants/queryParams";

import { TConcept } from "@/types";

type TProps = {
  concepts: TConcept[];
  startingSort?: TSort;
};

type TSort = "A-Z" | "Grouped";

const SORT_OPTIONS: TSort[] = ["A-Z", "Grouped"];

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

const filterConcepts = (concepts: TConcept[], search: string, selectedConcepts: string | string[] = "") => {
  return concepts.filter(
    (concept) =>
      !selectedConcepts.includes(concept.preferred_label.toLowerCase()) &&
      (concept.preferred_label.toLowerCase().includes(search.toLowerCase()) ||
        concept.alternative_labels.some((label) => label.toLowerCase().includes(search.toLowerCase())))
  );
};

const onConceptChange = (router: NextRouter, concept: TConcept) => {
  const query = { ...router.query };
  let selectedConcepts: string | string[] = query[QUERY_PARAMS.concept_name] || [];

  if (Array.isArray(selectedConcepts)) {
    if (selectedConcepts.includes(concept.preferred_label)) {
      selectedConcepts = selectedConcepts.filter((c) => c !== concept.preferred_label);
    } else {
      selectedConcepts = [...selectedConcepts, concept.preferred_label];
    }
  } else {
    if (selectedConcepts === concept.preferred_label) {
      selectedConcepts = [];
    } else {
      selectedConcepts = [selectedConcepts, concept.preferred_label];
    }
  }

  query[QUERY_PARAMS.concept_name] = selectedConcepts;

  router.push({ query: query }, undefined, { shallow: true });
};

export const ConceptPicker = ({ concepts, startingSort = "A-Z" }: TProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<TSort>(startingSort);
  const [rootConcepts, setRootConcepts] = useState<TConcept[]>([]);
  const [conceptsGrouped, setConceptsGrouped] = useState<{ [rootConceptId: string]: TConcept[] }>({});
  const [filteredConcepts, setFilteredConcepts] = useState<TConcept[]>([]);

  // Separate selected concepts from the rest for easy access and viewing
  const selectedConcepts = concepts.reduce((acc, concept) => {
    const queryValue = router.query[QUERY_PARAMS.concept_name];
    if (!queryValue) {
      return acc;
    }
    if (typeof queryValue === "string") {
      return queryValue === concept.preferred_label ? [...acc, concept] : acc;
    }
    return queryValue.includes(concept.preferred_label) ? [...acc, concept] : acc;
  }, [] as TConcept[]);

  useEffect(() => {
    const conceptIds = concepts.map((concept) => concept.wikibase_id);
    fetchAndProcessConcepts(conceptIds).then(({ rootConcepts, concepts }) => {
      setRootConcepts(rootConcepts);
      setFilteredConcepts(concepts);
      setConceptsGrouped(groupByRootConcept(concepts, rootConcepts));
    });
  }, [concepts]);

  return (
    <div className="relative flex flex-col gap-5 max-h-full pb-5">
      <div className="flex items-center gap-2">
        <div className="text-[15px] font-medium text-textDark">Concepts</div>
        <Label>Beta</Label>
      </div>
      <input type="text" placeholder="Quick search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="relative">
        <Select defaultValue="A-Z" value={sort} onValueChange={(value) => setSort(value as TSort)} options={SORT_OPTIONS} />
      </div>
      <div className="flex-1 flex flex-col gap-2 text-sm overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500">
        {/* SELECTED CONCEPTS */}
        {selectedConcepts.length > 0 && (
          <div className="pb-4 flex flex-col gap-2">
            <h5 className="text-textDark capitalize font-bold">Selected</h5>
            {selectedConcepts
              .sort((a, b) => conceptsSorter(a, b, "A-Z"))
              .map((concept) => (
                <InputCheck
                  key={concept.wikibase_id}
                  label={concept.preferred_label.slice(0, 1).toUpperCase() + concept.preferred_label.slice(1)}
                  checked={isSelected(router.query[QUERY_PARAMS.concept_name], concept.preferred_label)}
                  onChange={() => {
                    onConceptChange(router, concept);
                  }}
                  name={concept.preferred_label}
                />
              ))}
          </div>
        )}

        {/* GROUPED SORT */}
        {sort === "Grouped" &&
          rootConcepts.map((rootConcept) => {
            const filteredConcepts = filterConcepts(conceptsGrouped[rootConcept.wikibase_id], search, router.query[QUERY_PARAMS.concept_name]);
            if (filteredConcepts.length === 0) return null;
            return (
              <div className="pb-4 flex flex-col gap-2" key={rootConcept.wikibase_id}>
                <h5 className="text-textDark capitalize font-bold">{rootConcept.preferred_label}</h5>
                {filteredConcepts
                  .sort((a, b) => conceptsSorter(a, b, "A-Z"))
                  .map((concept) => (
                    <InputCheck
                      key={concept.wikibase_id}
                      label={concept.preferred_label.slice(0, 1).toUpperCase() + concept.preferred_label.slice(1)}
                      checked={isSelected(router.query[QUERY_PARAMS.concept_name], concept.preferred_label)}
                      onChange={() => {
                        onConceptChange(router, concept);
                      }}
                      name={concept.preferred_label}
                    />
                  ))}
              </div>
            );
          })}

        {/* A-Z SORT */}
        {sort === "A-Z" &&
          filterConcepts(filteredConcepts, search, router.query[QUERY_PARAMS.concept_name])
            .sort((a, b) => conceptsSorter(a, b, sort))
            .map((concept) => (
              <InputCheck
                key={concept.wikibase_id}
                label={concept.preferred_label.slice(0, 1).toUpperCase() + concept.preferred_label.slice(1)}
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
  );
};
