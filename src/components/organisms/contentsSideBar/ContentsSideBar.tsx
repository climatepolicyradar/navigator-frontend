import Link from "next/link";
import { useState } from "react";

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
}

export const ContentsSideBar = ({ items }: IProps) => {
  const [activeId, setActiveId] = useState("");
  useIntersectionObserver({ elementsQuery: "section", rootMargin: "-15% 0px 0px 0px", setActiveId });

  const scrollToItem = (id: string, itemIndex: number) => {
    if (itemIndex === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <div className="sticky top-0 select-none">
        <span className="text-sm font-semibold uppercase">On this page</span>
        <div className="pt-2">
          {items.map((item, itemIndex) => {
            const buttonClasses = joinTailwindClasses(
              "inline-block !px-2 !text-base leading-none text-text-tertiary",
              item.id === activeId ? "font-semibold" : "font-normal"
            );

            return (
              <div key={item.id}>
                <Link href={`#${item.id}`} onClick={() => scrollToItem(item.id, itemIndex)}>
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
    </div>
  );
};
