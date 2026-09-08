import { QUERY_PARAMS } from "@/constants/queryParams";
import { TSuggestedSearch } from "@/types";

export const SUGGESTED_SEARCHES: TSuggestedSearch[] = [
  {
    label: "Latest NDCs",
    params: {
      [QUERY_PARAMS.category]: "UN-submissions",
      [QUERY_PARAMS["_document.type"]]: "Nationally Determined Contribution",
      [QUERY_PARAMS.author_type]: "Party",
    },
    newParams: {
      [QUERY_PARAMS.filters]:
        '{"op":"and","filters":[{"field":"labels.value.id","op":"contains","value":"category::UN submission"},{"op":"and","filters":[{"field":"labels.value.id","op":"contains","value":"un_convention::UNFCCC"},{"op":"or","filters":[{"field":"labels.value.id","op":"contains","value":"entity_type::Nationally Determined Contribution (NDC)","checked":true}]}]}]}',
      [QUERY_PARAMS.sort]: "recent",
    },
  },
  {
    label: "Indigenous people + Brazil + Laws",
    params: {
      [QUERY_PARAMS.country]: "brazil",
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.concept_name]: "indigenous people",
    },
    newParams: {
      [QUERY_PARAMS.filters]:
        '{"op":"and","filters":[{"field":"labels.value.id","op":"contains","value":"category::Law","checked":true},{"op":"and","filters":[{"field":"labels.value.id","op":"contains","value":"region::LCN"},{"op":"or","filters":[{"field":"labels.value.id","op":"contains","value":"country::BRA","checked":true}]}]},{"field":"labels.value.id","op":"contains","value":"concept::Q684","checked":true}]}',
    },
  },
  {
    label: "Zoning and spatial planning + marine",
    params: {
      [QUERY_PARAMS.concept_name]: "zoning and spatial planning",
      [QUERY_PARAMS.query_string]: "marine",
      [QUERY_PARAMS.exact_match]: "true",
    },
    newParams: {
      [QUERY_PARAMS.query_string]: "marine",
      [QUERY_PARAMS.filters]: '{"op":"or","filters":[{"field":"labels.value.id","op":"contains","value":"concept::Q1282","checked":true}]}',
    },
  },
  {
    label: "Climate framework laws",
    params: {
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.framework_laws]: "true",
    },
    newParams: {
      [QUERY_PARAMS.filters]:
        '{"op":"and","filters":[{"field":"labels.value.id","op":"contains","value":"category::Law"},{"op":"or","filters":[{"field":"labels.value.id","op":"contains","value":"law_type::Framework law","checked":true}]}]}',
    },
  },
];
