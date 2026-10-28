import { describe, expect, it } from "vitest";

import { TCategory, TCorpusTypeSubCategory } from "@/types";

import { getTaxonomyFromV1 } from "./getTaxonomy";

describe("getTaxonomyFromV1", () => {
  it.each([
    ["UNFCCC", "Intl. agreements", "UNFCCC", "UN.corpus.UNCBD.n0000", "CBD Submission"],
    ["UNFCCC", "Intl. agreements", "UNFCCC", "UN.corpus.UNCCD.n0000", "UNCCD submission"],
    ["UNFCCC", "Intl. agreements", "UNCBD", "UNFCCC.corpus.i00000001.n0000", "CBD Submission"],
    ["Legislative", "Laws and Policies", "CCLW", "UNFCCC.corpus.i00000001.n0000", "UNFCCC submission"],
    ["UNFCCC", "Intl. agreements", "UNCBD", "Other.corpus", "CBD Submission"],
    ["UNFCCC", "Intl. agreements", "UNCCD", "Other.corpus", "UNCCD submission"],
    ["UNFCCC", "Intl. agreements", "UNFCCC", "Other.corpus", "UNFCCC submission"],
    ["UNFCCC", "Intl. agreements", "Other", "Other.corpus", "UN Submission"],
    ["Reports", "OEP", "Other", "Other.corpus", "Offshore Wind Report"],
    ["Reports", "Ocean Energy Pathways", "Other", "Other.corpus", "Offshore Wind Report"],
    ["Reports", "GCF", "Other", "Other.corpus", "Guidance"],
    ["REPORTS", "Global Environment Facility", "Other", "Other.corpus", "Guidance"],
    ["Reports", "Reports", "OEP", "Other.corpus", "Report"],
    ["MCF", "Reports", "AF", "Other.corpus", "Adaptation Fund"],
    ["MCF", "Reports", "The Climate Investment Funds", "Other.corpus", "Climate Investment Fund"],
    ["MCF", "Reports", "GCF", "Other.corpus", "Green Climate Fund"],
    ["MCF", "Reports", "Global Environment Facility", "Other.corpus", "Global Environment Facility"],
    ["MCF", "GCF", "Other", "Other.corpus", "multilateral climate fund project"],
    ["Law", "Laws and Policies", "CCLW", "CCLW.corpus.i00000001.n0000", "Legislative"],
    ["LEGISLATIVE", "Laws and Policies", "CCLW", "CCLW.corpus.i00000001.n0000", "Legislative"],
    ["Executive", "Laws and Policies", "CCLW", "CCLW.corpus.i00000001.n0000", "Policy"],
    ["Policy", "Laws and Policies", "CCLW", "CCLW.corpus.i00000001.n0000", "Policy"],
    ["LITIGATION", "Litigation", "Sabin", "Academic.corpus.Litigation.n0000", "Litigation"],
  ])("maps %s / %s / %s / %s to %s", (category: string, subCategory: string, source: string, corpusId: string, expected: string) => {
    expect(getTaxonomyFromV1(category as TCategory, subCategory as TCorpusTypeSubCategory, source, corpusId)).toBe(expected);
  });
});
