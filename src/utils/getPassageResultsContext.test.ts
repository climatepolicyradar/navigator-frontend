import { TTopic } from "@/types";

import { getPassageResultsContext } from "./getPassageResultsContext";

describe.skip("getPassageResultsContext", () => {
  const isExactSearch = false;
  const passageMatches = 512;
  const queryTerm = "banana";
  const selectedTopics: TTopic[] = [{ preferred_label: "Agriculture sector" }, { preferred_label: "Marine risk" }] as unknown[] as TTopic[];

  it("describes an exact match", () => {
    expect(getPassageResultsContext({ isExactSearch: true, passageMatches, queryTerm, selectedTopics: [] })).toBe(`Top 500 matches for "banana".`);
  });

  it("describes a semantic search", () => {
    expect(
      getPassageResultsContext({
        isExactSearch,
        passageMatches,
        queryTerm,
        selectedTopics: [],
      })
    ).toBe(`Top 500 matches for phrases related to "banana".`);
  });

  it("describes a semantic search and a topic", () => {
    expect(
      getPassageResultsContext({
        isExactSearch,
        passageMatches,
        queryTerm,
        selectedTopics: selectedTopics.slice(0, 1),
      })
    ).toBe(`Top 500 matches for phrases related to "banana" AND Agriculture sector.`);
  });

  it("describes a semantic search and multiple topics", () => {
    expect(
      getPassageResultsContext({
        isExactSearch,
        passageMatches,
        queryTerm,
        selectedTopics,
      })
    ).toBe(`Top 500 matches for phrases related to "banana" AND Agriculture sector AND Marine risk.`);
  });

  it("describes a topic", () => {
    expect(
      getPassageResultsContext({
        isExactSearch,
        passageMatches,
        queryTerm: "",
        selectedTopics: selectedTopics.slice(0, 1),
      })
    ).toBe(`Top 500 matches for Agriculture sector.`);
  });

  it("describes multiple topics", () => {
    expect(
      getPassageResultsContext({
        isExactSearch,
        passageMatches,
        queryTerm: "",
        selectedTopics: selectedTopics,
      })
    ).toBe(`Top 500 matches for Agriculture sector AND Marine risk.`);
  });

  it("describes a smaller number of matches", () => {
    expect(
      getPassageResultsContext({
        isExactSearch,
        passageMatches: 499,
        queryTerm: "",
        selectedTopics: selectedTopics.slice(0, 1),
      })
    ).toBe(`499 matches for Agriculture sector.`);
  });

  it("describes one match", () => {
    expect(
      getPassageResultsContext({
        isExactSearch,
        passageMatches: 1,
        queryTerm: "",
        selectedTopics: selectedTopics.slice(0, 1),
      })
    ).toBe(`1 match for Agriculture sector.`);
  });
});
