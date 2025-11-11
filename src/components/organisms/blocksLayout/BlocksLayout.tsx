import { ReactNode, useEffect, useState } from "react";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { firstCase } from "@/utils/text";

import { ContentsSideBar, ISideBarItem } from "../contentsSideBar/ContentsSideBar";

type TSideBarItemPartial = {
  display?: string;
  context?: string[];
};

type TBlockDefinition = {
  sideBarItem?: TSideBarItemPartial;
  render: () => ReactNode | null;
};
export type TBlockDefinitions<PageBlock extends string> = Record<PageBlock, TBlockDefinition>;

interface IProps<PageBlock extends string> {
  blocksToRender: PageBlock[]; // Ordered list of blocks to render
  blockDefinitions: TBlockDefinitions<PageBlock>; // How to render each block and its sidebar item
}

/**
 * Renders a sidebar and main content layout containing multiple block components
 * If you are expecting a component to render and it isn't:
 * 1. Check themeConfig.pageBlocks includes the block name for the given page
 * 2. Check if the blockDefinitions render method is returning null (won't render the block or sidebar item)
 */
export const BlocksLayout = <PageBlock extends string>({ blockDefinitions, blocksToRender }: IProps<PageBlock>) => {
  const [renderedSectionIds, setRenderedSectionIds] = useState<string[] | null>(null);

  // Check which sections are rendered on the page
  // This allows a sidebar item to be hidden if the block component renders but internally returns null
  useEffect(() => {
    if (document) {
      const sections = Array.from(document.querySelectorAll("section"));
      const sectionIds = sections.map((section) => (section.getAttribute("id") || "").replace("section-", "")).filter((id) => id !== "");
      setRenderedSectionIds(sectionIds);
    }
  }, [blockDefinitions]);

  const blocks: ReactNode[] = [];
  const sideBarItems: ISideBarItem[] = [];

  blocksToRender.forEach((blockName) => {
    const blockDefinition = blockDefinitions[blockName];

    // A block can return null for cases where a lack of data means the block shouldn't show
    const renderedBlock = blockDefinition.render();

    if (renderedBlock) {
      blocks.push(renderedBlock);

      // Only show a corresponding sidebar item if the block renders a section
      if (renderedSectionIds === null || renderedSectionIds.includes(blockName)) {
        sideBarItems.push({
          id: `section-${blockName}`, // If you're writing a new block, make sure its section ID and block names line up
          display: blockDefinition.sideBarItem?.display || firstCase(blockName), // Can be inferred from block name
          context: blockDefinition.sideBarItem?.context || undefined,
        });
      }
    }
  });

  return (
    <FiveColumns>
      <ContentsSideBar items={sideBarItems} stickyClasses="cols-3:!top-26 cols-3:max-h-[calc(100vh-72px)]" />
      <main className="pb-8 grid grid-cols-subgrid gap-y-8 col-start-1 -col-end-1 cols-4:col-start-3">{blocks}</main>
    </FiveColumns>
  );
};
