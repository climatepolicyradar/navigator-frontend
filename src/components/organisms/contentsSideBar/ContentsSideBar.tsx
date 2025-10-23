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
  containerClasses?: string;
  stickyClasses?: string;
}

export const ContentsSideBar = ({ containerClasses, items, stickyClasses }: IProps) => {
  const [activeId, setActiveId] = useState("");
  useIntersectionObserver({ elementsQuery: "section", rootMargin: "-15% 0px 0px 0px", setActiveId });

  const scrollToItem = (id: string) => (event: MouseEvent<HTMLButtonElement>) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const allContainerClasses = joinTailwindClasses("relative select-none", containerClasses);
  const allStickyClasses = joinTailwindClasses(
    "sticky top-0 overflow-y-auto scrollbar-thumb-scrollbar scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-scrollbar-darker",
    stickyClasses
  );

  return (
    <aside className={allContainerClasses}>
      <div className={allStickyClasses}>
        <div className="inline-flex flex-col">
          <h2 className="mb-4 text-2xl text-gray-950 font-heavy leading-tight cols-3:hidden">On this page</h2>
          {items.map((item) => {
            const isActive = item.id === activeId;

            const buttonClasses = joinTailwindClasses(
              "pr-4 cols-3:pl-4 py-2 text-sm text-left group cols-3:border-l-2",
              isActive ? "border-l-brand cols-3:text-gray-950 cols-3:font-heavy" : "border-l-transparent text-gray-700 hover:text-gray-950"
            );
            const contextClasses = joinTailwindClasses(
              "block pt-1 text-xs font-normal",
              isActive ? "cols-3:text-gray-950" : "text-gray-500 group-hover:text-gray-950"
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
