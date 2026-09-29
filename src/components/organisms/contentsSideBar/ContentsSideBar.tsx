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
    <aside className="hidden cols-4:block relative pb-0 col-start-1 col-end-3 select-none">
      <div className={allStickyClasses}>
        <div className="inline-flex flex-col">
          {items.map((item) => {
            const isActive = "section-" + item.id === activeId;

            const buttonClasses = joinTailwindClasses(
              "pr-4 pl-4 py-2 text-sm text-left group border-l-2",
              isActive ? "border-l-text-accent text-text-heading font-heavy" : "border-l-transparent text-text-content hover:text-text-heading"
            );
            const contextClasses = joinTailwindClasses(
              "block pt-1 text-xs font-normal",
              isActive ? "text-text-heading" : "text-text-hint group-hover:text-text-heading"
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
