import { MouseEvent, useState } from "react";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { joinTailwindClasses } from "@/utils/tailwind";

export interface ISideBarItem {
  id: string;
  display: string;
  context?: string[];
}

export interface IProps {
  items: ISideBarItem[];
  stickyClasses?: string;
}

export const ContentsSideBar = ({ items, stickyClasses }: IProps) => {
  const [activeId, setActiveId] = useState("");
  useIntersectionObserver({ elementsQuery: "section", rootMargin: "-15% 0px 0px 0px", setActiveId });

  const scrollToItem = (id: string) => () => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const allStickyClasses = joinTailwindClasses(
    "sticky top-0 overflow-y-auto scrollbar-thumb-scrollbar scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-scrollbar-darker",
    stickyClasses
  );

  return (
    <aside className="relative pb-8 cols5-4:pb-0 col-start-1 cols5-4:col-end-3 -col-end-1 select-none">
      <div className={allStickyClasses}>
        <div className="inline-flex flex-col">
          <h2 className="mb-4 text-2xl text-gray-950 font-heavy leading-tight cols5-4:hidden">On this page</h2>
          {items.map((item) => {
            const isActive = item.id === activeId;

            const buttonClasses = joinTailwindClasses(
              "pr-4 cols5-4:pl-4 py-2 text-sm text-left group cols5-4:border-l-2",
              isActive ? "border-l-brand cols5-4:text-gray-950 cols5-4:font-heavy" : "border-l-transparent text-gray-700 hover:text-gray-950"
            );
            const contextClasses = joinTailwindClasses(
              "block pt-1 text-xs font-normal",
              isActive ? "cols5-4:text-gray-950" : "text-gray-500 group-hover:text-gray-950"
            );

            return (
              <button key={item.id} type="button" role="navigation" onClick={scrollToItem(item.id)} className={buttonClasses}>
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
