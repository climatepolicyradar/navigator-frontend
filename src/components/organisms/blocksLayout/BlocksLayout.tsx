import { ReactNode } from "react";

import { Columns } from "@/components/atoms/columns/Columns";
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
  blockDefinitions: TBlockDefinitions<PageBlock>;
  blocksToRender: PageBlock[];
}

/**
 * TODO
 * [ ] Determine typing for listing blocks and their render methods
 * [ ] Memoisation concerns
 * [ ] Generic typing to ensure all blocks are accounted for
 */

export const BlocksLayout = <PageBlock extends string>({ blockDefinitions, blocksToRender }: IProps<PageBlock>) => {
  const blocks: ReactNode[] = [];
  const sideBarItems: ISideBarItem[] = [];

  blocksToRender.forEach((blockId) => {
    const blockDefinition = blockDefinitions[blockId];

    const renderedBlock = blockDefinition.render();
    if (renderedBlock) {
      blocks.push(renderedBlock);
      sideBarItems.push({
        id: `section-${blockId}`,
        display: blockDefinition.sideBarItem?.display || firstCase(blockId),
        context: blockDefinition.sideBarItem?.context || undefined,
      });
    }
  });

  return (
    <Columns>
      <ContentsSideBar items={sideBarItems} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
      <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-2:col-span-2 cols-3:py-8 cols-3:gap-8 cols-4:col-span-3">{blocks}</main>
    </Columns>
  );
};

// sidebar item:
// title
// metadata (list of strings), slashes between
// id to link to (matches ID?)
