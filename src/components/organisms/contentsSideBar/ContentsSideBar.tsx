import { useState } from "react";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { TBlock } from "@/types";
import { scrollToBlock } from "@/utils/blocks/scrollToBlock";
import { joinTailwindClasses } from "@/utils/tailwind";

export interface ISideBarItem<BlockId extends string = TBlock> {
  id: BlockId;
  display: string;
  context?: string[];
}

interface IProps<BlockId extends string = TBlock> {
  items: ISideBarItem<BlockId>[];
  stickyClasses?: string;
}

export const ContentsSideBar = <BlockId extends string = TBlock>({ items, stickyClasses }: IProps<BlockId>) => {
  const [activeId, setActiveId] = useState("");
  useIntersectionObserver({ elementsQuery: "section", rootMargin: "-15% 0px 0px 0px", setActiveId });

  const allStickyClasses = joinTailwindClasses(
    "sticky top-0 overflow-y-auto scrollbar-thumb-scrollbar scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-scrollbar-darker",
    stickyClasses
  );

  return (
    <aside className="relative pb-8 cols-4:pb-0 col-start-1 cols-4:col-end-3 -col-end-1 select-none">
      <div className={allStickyClasses}>
        <div className="inline-flex flex-col">
          <h2 className="mb-4 text-2xl text-gray-950 font-heavy leading-tight cols-4:hidden">On this page</h2>
          {items.map((item) => {
            const isActive = "section-" + item.id === activeId;

            const buttonClasses = joinTailwindClasses(
              "pr-4 cols-4:pl-4 py-2 text-sm text-left group cols-4:border-l-2",
              isActive ? "border-l-brand cols-4:text-gray-950 cols-4:font-heavy" : "border-l-transparent text-gray-700 hover:text-gray-950"
            );
            const contextClasses = joinTailwindClasses(
              "block pt-1 text-xs font-normal",
              isActive ? "cols-4:text-gray-950" : "text-gray-500 group-hover:text-gray-950"
            );

            return (
              <button
                key={item.id}
                type="button"
                role="navigation"
                onClick={scrollToBlock<BlockId>(item.id)}
                className={buttonClasses}
                data-ph-capture-attribute-side-bar-id={item.id}
              >
                <span className="">{item.display}</span>
                {item.context?.length > 0 && <span className={contextClasses}>{item.context.join(" / ")}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
