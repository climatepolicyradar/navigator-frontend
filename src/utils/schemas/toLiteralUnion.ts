import * as v from "valibot";

export const toLiteralUnion = (values: string[] | readonly string[]) => v.union(values.map((value) => v.literal(value)));
