import { COMMON_DOCUMENT_TYPE_LABELS } from "@/constants/documentTypeLabels";
import themeConfig from "@/themes/config";
import { TLabel, TLabelCondition, TLabelMatch, TLabelPattern } from "@/types";

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

export const getDocumentTypeLabel = (labels: TLabel[], rules?: ReadonlyArray<TLabelPattern>): string | null => {
  for (const rule of rules ?? [...themeConfig.documentTypeLabels, ...COMMON_DOCUMENT_TYPE_LABELS]) {
    const matched = findLabels(labels, rule.match);

    if (matched !== null) {
      return matched.reduce((text, label) => text.replaceAll(`{{${label.type}}}`, label.value), rule.pattern);
    }
  }
  return labels.find((label) => label.type === "category")?.value ?? null;
};
