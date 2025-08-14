import { describe, it, expect } from "vitest";

import { TFamilyConcept } from "@/types";

import { buildConceptHierarchy } from "./buildConceptHierarchy";

const concepts: TFamilyConcept[] = [
  { id: "1", preferred_label: "Root", subconcept_of_labels: [], type: "A", ids: [], relation: "" },
  { id: "2", preferred_label: "Child1", subconcept_of_labels: ["Root"], type: "A", ids: [], relation: "" },
  { id: "3", preferred_label: "Child2", subconcept_of_labels: ["Root"], type: "A", ids: [], relation: "" },
  { id: "4", preferred_label: "Grandchild", subconcept_of_labels: ["Child1"], type: "A", ids: [], relation: "" },
  { id: "5", preferred_label: "OtherRoot", subconcept_of_labels: [], type: "B", ids: [], relation: "" },
  { id: "6", preferred_label: "OtherChild", subconcept_of_labels: ["OtherRoot"], type: "B", ids: [], relation: "" },
];

describe("buildConceptHierarchy", () => {
  it("should build a hierarchy with correct root nodes", () => {
    const tree = buildConceptHierarchy(concepts);
    expect(tree).toHaveLength(2);
    expect(tree[0].preferred_label).toBe("Root");
    expect(tree[1].preferred_label).toBe("OtherRoot");
  });

  it("should build children and grandchildren correctly", () => {
    const tree = buildConceptHierarchy(concepts);
    const root = tree.find((node) => node.preferred_label === "Root")!;
    expect(root.children).toHaveLength(2);
    const child1 = root.children.find((c) => c.preferred_label === "Child1")!;
    expect(child1.children).toHaveLength(1);
    expect(child1.children[0].preferred_label).toBe("Grandchild");
  });

  it("should only include children of the same type", () => {
    const tree = buildConceptHierarchy(concepts);
    const rootA = tree.find((node) => node.preferred_label === "Root")!;
    expect(rootA.children.every((c) => c.type === "A")).toBe(true);
    const rootB = tree.find((node) => node.preferred_label === "OtherRoot")!;
    expect(rootB.children.every((c) => c.type === "B")).toBe(true);
  });

  it("should ignore cyclic references", () => {
    const cyclicConcepts: TFamilyConcept[] = [
      { id: "1", preferred_label: "Root", subconcept_of_labels: [], type: "Root", ids: [], relation: "" },
      { id: "1", preferred_label: "A", subconcept_of_labels: ["Root", "B"], type: "A", ids: [], relation: "" },
      { id: "1", preferred_label: "A2", subconcept_of_labels: ["A"], type: "A", ids: [], relation: "" },
      { id: "2", preferred_label: "B", subconcept_of_labels: ["A"], type: "A", ids: [], relation: "" },
    ];
    const tree = buildConceptHierarchy(cyclicConcepts);
    expect(tree).toHaveLength(1);
    expect(tree[0].preferred_label).toBe("Root");
  });

  it("should return an empty array if no concepts are provided", () => {
    expect(buildConceptHierarchy([])).toEqual([]);
  });

  it("should handle concepts with multiple parents gracefully", () => {
    const multiParentConcepts: TFamilyConcept[] = [
      { id: "1", preferred_label: "Root1", subconcept_of_labels: [], type: "A", ids: [], relation: "" },
      { id: "2", preferred_label: "Root2", subconcept_of_labels: [], type: "A", ids: [], relation: "" },
      { id: "3", preferred_label: "Child", subconcept_of_labels: ["Root1", "Root2"], type: "A", ids: [], relation: "" },
    ];
    const tree = buildConceptHierarchy(multiParentConcepts);
    expect(tree).toHaveLength(2);
    expect(tree[0].children[0].preferred_label).toBe("Child");
    expect(tree[1].children[0].preferred_label).toBe("Child");
  });
});
