import { TLabelPattern } from "@/types";
import { and, or } from "@/utils/data-in/labelConditions";

export const COMMON_DOCUMENT_TYPE_LABELS: TLabelPattern[] = [
  {
    match: { type: "un_convention" },
    pattern: "{{un_convention}}",
  },
  {
    match: and({ id: "category::Report" }, { id: "agent::Ocean Energy Pathways" }),
    pattern: "Offshore Wind Report",
  },
  {
    match: and(
      { id: "category::Report" },
      or(
        { id: "agent::Adaptation Fund" },
        { id: "agent::The Climate Investment Funds" },
        { id: "agent::Green Climate Fund" },
        { id: "agent::Global Environment Facility" }
      )
    ),
    pattern: "Guidance",
  },
  {
    match: { type: "report_type" },
    pattern: "{{report_type}}",
  },
  {
    match: and({ id: "category::Multilateral Climate Fund project" }, { id: "agent::Adaptation Fund" }),
    pattern: "Adaptation Fund",
  },
  {
    match: and({ id: "category::Multilateral Climate Fund project" }, { id: "agent::The Climate Investment Funds" }),
    pattern: "Climate Investment Fund",
  },
  {
    match: and({ id: "category::Multilateral Climate Fund project" }, { id: "agent::Green Climate Fund" }),
    pattern: "Green Climate Fund",
  },
  {
    match: and({ id: "category::Multilateral Climate Fund project" }, { id: "agent::Global Environment Facility" }),
    pattern: "Global Environment Facility",
  },
  {
    match: { id: "category::Law" },
    pattern: "Legislative",
  },
  {
    match: { id: "category::UN submission" },
    pattern: "UN submission",
  },
];
