import { ReactNode } from "react";

import { Button } from "@/components/atoms/button/Button";

export interface ISideBarItem {
  id: string;
  display: string;
}

interface IProps {
  items: ISideBarItem[];
}

export const ContentsSideBar = ({ items }: IProps) => (
  <div>
    <span className="text-sm font-semibold select-none uppercase">On this page</span>
    <div className="pt-2">
      {items.map((item) => (
        <Button key={item.id} color="mono" size="small" variant="ghost" className="!px-2 !text-base leading-none font-normal text-text-tertiary">
          {item.display}
        </Button>
      ))}
    </div>
  </div>
);
