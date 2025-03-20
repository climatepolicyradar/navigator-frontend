import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";

import { Label } from "@/components/labels/Label";
import { InputCheck } from "@/components/forms/Checkbox";

import { TConcept } from "@/types";

import { QUERY_PARAMS } from "@/constants/queryParams";

type TProps = {
  concepts: TConcept[];
};

const SORT_OPTIONS = ["A-Z", "Grouped"];

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

const filterConcepts = (concepts: TConcept[], search: string, selectedConcepts: string | string[] = "") => {
  return concepts.filter(
    (concept) =>
      !selectedConcepts.includes(concept.preferred_label) &&
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

export const ConceptPicker = ({ concepts }: TProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("A-Z");
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
    setFilteredConcepts(
      filterConcepts(concepts, search, router.query[QUERY_PARAMS.concept_name]).sort((a, b) => a.preferred_label.localeCompare(b.preferred_label))
    );
  }, [concepts, search, router.query]);

  return (
    <div className="relative flex flex-col gap-5 max-h-full pb-5">
      <div className="flex items-center gap-2">
        <div className="text-[15px] font-medium text-textDark">Concepts</div>
        <Label>Beta</Label>
      </div>
      <input type="text" placeholder="Quick search" value={search} onChange={(e) => setSearch(e.target.value)} />
      {/* SORT PICKER
      <div className="text-sm">
        <label>Sort by:</label>
        <select name="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div> */}
      <div className="flex-1 flex flex-col gap-2 text-sm overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500">
        {selectedConcepts.map((concept) => (
          <InputCheck
            key={concept.wikibase_id}
            label={concept.preferred_label}
            checked={isSelected(router.query[QUERY_PARAMS.concept_name], concept.preferred_label)}
            onChange={() => {
              onConceptChange(router, concept);
            }}
            name={concept.preferred_label}
          />
        ))}
        {filteredConcepts.map((concept) => (
          <InputCheck
            key={concept.wikibase_id}
            label={concept.preferred_label}
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
