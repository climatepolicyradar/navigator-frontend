import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import * as nextRouterMock from "next-router-mock";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";

import { DEFAULT_FEATURES } from "@/constants/features";
import { IFamilyDocumentTopics, TFamilyPublic, TTopic } from "@/types";

import { TopicsBlock } from "./TopicsBlock";

vi.mock("next/router", () => nextRouterMock);

// The drawer's own contents are covered by its own tests. Stubbed so this suite is only about
// which topic the URL puts in the drawer, and whether it is open.
vi.mock("@/components/drawers/topicDrawer/TopicDrawer", () => ({
  TopicDrawer: ({
    onOpenChange,
    open,
    topicWikibaseId,
  }: {
    onOpenChange: (open: boolean) => void;
    open: boolean;
    topicWikibaseId: string | null;
  }) => (
    <>
      <p>
        drawer: {open ? "open" : "closed"}, showing {topicWikibaseId ?? "nothing"}
      </p>
      <button onClick={() => onOpenChange(false)}>close the drawer</button>
    </>
  ),
}));

const topic = (wikibaseId: string, label: string): TTopic => ({
  alternative_labels: [],
  description: "",
  has_subconcept: [],
  negative_labels: [],
  preferred_label: label,
  recursive_subconcept_of: [],
  related_concepts: [],
  subconcept_of: [],
  wikibase_id: wikibaseId,
});

const familyTopics: IFamilyDocumentTopics = {
  documents: [],
  conceptCounts: { Q10: 3, Q11: 1 },
  rootConcepts: [topic("Q1", "extreme weather")],
  conceptsGrouped: { Q1: [topic("Q10", "flooding"), topic("Q11", "drought")] },
};

const renderBlock = (searchParams: Record<string, string> = {}) => {
  const onUrlUpdate = vi.fn();
  render(<TopicsBlock family={{} as TFamilyPublic} familyTopics={familyTopics} features={DEFAULT_FEATURES} getCategoryText={() => "law"} />, {
    wrapper: withNuqsTestingAdapter({ searchParams, onUrlUpdate, hasMemory: true }),
  });
  return onUrlUpdate;
};

describe("TopicsBlock", () => {
  beforeEach(() => mockRouter.setCurrentUrl("/document/a-climate-law"));

  it("opens the drawer by pushing the topic onto the URL, so the click is its own page view", async () => {
    const onUrlUpdate = renderBlock();

    expect(screen.getByText(/drawer: closed/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Flooding" }));

    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    const { options, searchParams } = onUrlUpdate.mock.calls[0][0];
    expect(options.history).toBe("push");
    expect(searchParams.get("topic")).toBe("Q10");
    expect(await screen.findByText(/drawer: open, showing Q10/)).toBeInTheDocument();
  });

  it("opens on the topic in the URL, so the drawer can be linked to", () => {
    renderBlock({ topic: "Q11" });

    expect(screen.getByText(/drawer: open, showing Q11/)).toBeInTheDocument();
  });

  it("closes by removing the topic, keeping it in the drawer while it animates out", async () => {
    const onUrlUpdate = renderBlock({ topic: "Q11" });

    await userEvent.click(screen.getByRole("button", { name: "close the drawer" }));

    expect(onUrlUpdate).toHaveBeenCalledTimes(1);
    expect(onUrlUpdate.mock.calls[0][0].searchParams.get("topic")).toBeNull();
    expect(await screen.findByText(/drawer: closed, showing Q11/)).toBeInTheDocument();
  });
});
