import { TLabel, TLabelCondition, TLabelMatch, TLabelPattern } from "@/types";

export const and = (...conditions: TLabelCondition[]): TLabelCondition => ({ and: conditions });

export const or = (...conditions: TLabelCondition[]): TLabelCondition => ({ or: conditions });

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
  {
    match: { type: "category" },
    pattern: "{{category}}",
  },
];

const matchesLabel = (label: TLabel, match: TLabelMatch): boolean =>
  Object.entries(match).every(([key, value]) => label[key as keyof TLabelMatch] === value);

const findMatch = (labels: TLabel[], match: TLabelMatch): TLabel[] | null => {
  const label = labels.find((label) => matchesLabel(label, match));
  return label === undefined ? null : [label];
};

const findAll = (labels: TLabel[], conditions: ReadonlyArray<TLabelCondition>): TLabel[] | null => {
  const matched = conditions.map((condition) => findLabels(labels, condition));
  return matched.some((found) => found === null) ? null : matched.flat();
};

const findFirst = (labels: TLabel[], conditions: ReadonlyArray<TLabelCondition>): TLabel[] | null => {
  const matched = conditions.map((condition) => findLabels(labels, condition));
  return matched.find((found) => found !== null) ?? null;
};

const findLabels = (labels: TLabel[], condition: TLabelCondition): TLabel[] | null => {
  if ("and" in condition) {
    return findAll(labels, condition.and);
  } else if ("or" in condition) {
    return findFirst(labels, condition.or);
  }
  return findMatch(labels, condition);
};

export const getDocumentTypeLabel = (labels: TLabel[], rules: ReadonlyArray<TLabelPattern>): string => {
  for (const rule of rules) {
    const matched = findLabels(labels, rule.match);
    if (matched !== null) {
      return matched.reduce((text, label) => text.replaceAll(`{{${label.type}}}`, label.value), rule.pattern);
    }
  }
  throw new Error("No document type label rule matched");
};
