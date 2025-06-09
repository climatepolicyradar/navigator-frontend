import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { joinTailwindClasses } from "@/utils/tailwind";

export interface ISideBarItem {
  display: string;
  id: string;
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
      <div className="sticky top-0">
        <span className="text-sm font-semibold select-none uppercase">On this page</span>
        <div className="pt-2">
          {items.map((item, itemIndex) => {
            const buttonClasses = joinTailwindClasses(
              "!px-2 !text-base leading-none text-text-tertiary",
              item.id === activeId ? "font-semibold" : "font-normal"
            );

            return (
              <Link href={`#${item.id}`} key={item.id} onClick={() => scrollToItem(item.id, itemIndex)}>
                <Button color="mono" size="small" variant="ghost" className={buttonClasses}>
                  {item.display}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
