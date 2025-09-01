import Link from "next/link";
import { MouseEvent, useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Badge } from "@/components/atoms/label/Badge";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { joinTailwindClasses } from "@/utils/tailwind";

export interface ISideBarItem {
  id: string;
  display: string;
  badge?: string;
}

interface IProps {
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
  const allStickyClasses = joinTailwindClasses("sticky top-0", stickyClasses);

  return (
    <aside className={allContainerClasses}>
      <div className={allStickyClasses}>
        <span className="text-sm font-semibold uppercase">On this page</span>
        <div className="pt-2">
          {items.map((item, itemIndex) => {
            const buttonClasses = joinTailwindClasses(
              "inline-block !px-2 !text-base text-text-tertiary text-left leading-none",
              item.id === activeId ? "font-semibold" : "font-normal"
            );

            return (
              <div key={item.id}>
                <Link href={`#${item.id}`} onClick={scrollToItem(item.id)}>
                  <Button color="mono" size="small" variant="ghost" className={buttonClasses}>
                    {item.display}
                  </Button>
                </Link>
                {item.badge && (
                  <>
                    &nbsp;<Badge>{item.badge}</Badge>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
