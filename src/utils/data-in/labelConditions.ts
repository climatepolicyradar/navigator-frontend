import { TLabelCondition } from "@/types";

export const and = (...conditions: TLabelCondition[]): TLabelCondition => ({ and: conditions });

export const or = (...conditions: TLabelCondition[]): TLabelCondition => ({ or: conditions });
