import { describe, expect, it } from "vitest";

import cprConfig from "@/cpr/config";
import { TLabel } from "@/types";

import { COMMON_DOCUMENT_TYPE_LABELS, getDocumentTypeLabel } from "./getDocumentTypeLabel";

const label = (id: string): TLabel => {
  const [type, value] = id.split("::");
  return { id, type, value };
};

describe("getDocumentTypeLabel", () => {
  describe("on CPR", () => {
    const getLabel = (labels: TLabel[]): string | null => {
      const rules = [...cprConfig.documentTypeLabels, ...COMMON_DOCUMENT_TYPE_LABELS];
      return getDocumentTypeLabel(labels, rules);
    };

    it("shows the treaty and GST round", () => {
      const labels = ["category::UN submission", "category::Global Stocktake", "un_convention::UNFCCC", "process::GST1"].map(label);
      expect(getLabel(labels)).toBe("UNFCCC, Global Stocktake 1");
    });

    it("shows the treaty and GST when there is no round", () => {
      const labels = ["category::UN submission", "category::Global Stocktake", "un_convention::UNFCCC"].map(label);
      expect(getLabel(labels)).toBe("UNFCCC, Global Stocktake");
    });

    it("shows UN submission and GST round when there is no treaty", () => {
      const labels = ["category::UN submission", "category::Global Stocktake", "process::GST1"].map(label);
      expect(getLabel(labels)).toBe("UN submission, Global Stocktake 1");
    });

    it("shows UN submission and GST when there is no treaty or round", () => {
      const labels = ["category::UN submission", "category::Global Stocktake"].map(label);
      expect(getLabel(labels)).toBe("UN submission, Global Stocktake");
    });

    it("shows only the GST round when not a UN submission", () => {
      const labels = ["category::Global Stocktake", "process::GST1"].map(label);
      expect(getLabel(labels)).toBe("Global Stocktake 1");
    });

    it("matches nothing for GST alone, leaving it to the category fallback", () => {
      const labels = ["category::Global Stocktake"].map(label);
      expect(getLabel(labels)).toBeNull();
    });
  });

  describe("on other sites", () => {
    const getLabel = (labels: TLabel[]): string | null => {
      const rules = COMMON_DOCUMENT_TYPE_LABELS;
      return getDocumentTypeLabel(labels, rules);
    };

    it("shows only the treaty, never GST", () => {
      const labels = ["category::UN submission", "category::Global Stocktake", "un_convention::UNFCCC", "process::GST1"].map(label);
      expect(getLabel(labels)).toBe("UNFCCC");
    });

    it("shows UN submission, never GST, when there is no treaty", () => {
      const labels = ["category::UN submission", "category::Global Stocktake"].map(label);
      expect(getLabel(labels)).toBe("UN submission");
    });

    it("shows the report type", () => {
      const labels = ["category::Report", "report_type::Industry report"].map(label);
      expect(getLabel(labels)).toBe("Industry report");
    });

    it("shows Offshore Wind Report for OEP reports", () => {
      const labels = ["category::Report", "agent::Ocean Energy Pathways"].map(label);
      expect(getLabel(labels)).toBe("Offshore Wind Report");
    });

    it("shows Guidance for fund reports", () => {
      const labels = ["category::Report", "agent::Green Climate Fund"].map(label);
      expect(getLabel(labels)).toBe("Guidance");
    });

    it("shows the fund name for fund projects", () => {
      const labels = ["category::Multilateral Climate Fund project", "agent::The Climate Investment Funds"].map(label);
      expect(getLabel(labels)).toBe("Climate Investment Fund");
    });

    it("shows Legislative for laws", () => {
      const labels = ["category::Law"].map(label);
      expect(getLabel(labels)).toBe("Legislative");
    });

    it("matches nothing for other categories, leaving them to the category fallback", () => {
      const labels = ["category::Policy"].map(label);
      expect(getLabel(labels)).toBeNull();
    });
  });
});
