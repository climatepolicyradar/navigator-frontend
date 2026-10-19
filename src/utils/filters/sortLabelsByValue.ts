import { TNestedSearchLabel } from "@/types";

// Collator shared across calls: constructing one per comparison is expensive on long filter lists.
// `base` sensitivity keeps case and accents from partitioning the list, so acronyms such as "NDC 2020"
// sort into their alphabetical position instead of ahead of every mixed-case peer.
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

export const compareLabelValues = (a: string, b: string) => collator.compare(a, b);

export const sortLabelsByValue = <T extends Pick<TNestedSearchLabel, "value">>(labels: T[]): T[] =>
  [...labels].sort((a, b) => compareLabelValues(a.value, b.value));
