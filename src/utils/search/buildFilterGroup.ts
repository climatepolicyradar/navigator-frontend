import { TFilterPathLabel, TSearchQueryGroup, TSearchQueryRule } from "@/types";

const makeRule = (id: string): TSearchQueryRule => ({
  field: "labels.value.id",
  op: "contains",
  value: id,
});

const wrapInGroup = (result: TSearchQueryGroup | TSearchQueryRule): TSearchQueryGroup =>
  "field" in result ? { op: "or", filters: [result] } : result;

const buildGroupFromPaths = (paths: TFilterPathLabel[][]): TSearchQueryGroup | TSearchQueryRule => {
  const byRootId = new Map<string, TFilterPathLabel[][]>();
  for (const path of paths) {
    const key = path[0].id;
    const bucket = byRootId.get(key) ?? [];
    bucket.push(path);
    byRootId.set(key, bucket);
  }

  const rootResults: [string, TSearchQueryGroup | TSearchQueryRule][] = [];
  for (const [rootId, rootPaths] of byRootId) {
    const rootType = rootPaths[0][0].type;
    const childPaths = rootPaths.map((p) => p.slice(1)).filter((p) => p.length > 0);
    const rootRule = makeRule(rootId);

    if (childPaths.length === 0) {
      rootResults.push([rootType, rootRule]);
    } else {
      const childResult = buildGroupFromPaths(childPaths);
      rootResults.push([rootType, { op: "and", filters: [rootRule, childResult] }]);
    }
  }

  const byType = new Map<string, (TSearchQueryGroup | TSearchQueryRule)[]>();
  for (const [type, result] of rootResults) {
    const bucket = byType.get(type) ?? [];
    bucket.push(result);
    byType.set(type, bucket);
  }

  const typeGroupResults: (TSearchQueryGroup | TSearchQueryRule)[] = [];
  for (const results of byType.values()) {
    typeGroupResults.push(results.length === 1 ? results[0] : { op: "or", filters: results });
  }

  if (typeGroupResults.length === 1) return typeGroupResults[0];
  return { op: "and", filters: typeGroupResults };
};

export const buildFilterGroup = (allPathLabels: TFilterPathLabel[][]): TSearchQueryGroup => {
  const reversed = allPathLabels.map((path) => [...path].reverse());
  const deduplicated = reversed.filter(
    (path) => !reversed.some((other) => other !== path && other.length > path.length && path.every((label, i) => label.id === other[i].id))
  );
  return wrapInGroup(buildGroupFromPaths(deduplicated));
};
