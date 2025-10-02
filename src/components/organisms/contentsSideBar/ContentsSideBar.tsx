import Link from "next/link";
import { MouseEvent, useState } from "react";

import { Button } from "@/components/atoms/button/Button";
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

  const scrollToItem = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

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
        <span className="block pb-2 text-xs text-text-primary font-[660] leading-none uppercase">On this page</span>
        <div className="flex flex-col gap-1 pr-1">
          {items.map((item) => {
            const isActive = item.id === activeId;

            const buttonClasses = joinTailwindClasses(
              "w-full px-2.5 py-3 rounded-sm !flex-col items-start gap-3 text-sm text-left leading-none",
              isActive ? "!bg-surface-ui text-text-secondary" : "text-text-tertiary"
            );
            const displayClasses = joinTailwindClasses("block font-[660]", isActive && "text-text-primary");

            return (
              <Link key={item.id} href={`#${item.id}`} onClick={scrollToItem(item.id)}>
                <Button color="mono" size="small" variant="ghost" className={buttonClasses}>
                  <span className={displayClasses}>{item.display}</span>
                  {item.context?.length > 0 && <span className="block pl-2.5">{item.context.join(" / ")}</span>}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
