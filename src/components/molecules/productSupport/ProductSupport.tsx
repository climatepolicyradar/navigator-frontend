import Image from "next/image";
import { ReactNode, useState } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { PRODUCT_SUPPORT } from "@/constants/productSupport";
import { TProductSupportKey } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProductSupportTooltip {
  children?: never;
  className?: string;
  content: TProductSupportKey;
  tooltip: true;
}

interface IProductSupportNode {
  children: ReactNode;
  className?: string;
  content: TProductSupportKey;
  tooltip?: never;
}

type TProps = IProductSupportTooltip | IProductSupportNode;

export const ProductSupport = ({ children, className, content, tooltip }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { title, items } = PRODUCT_SUPPORT[content];
  const buttonClasses = joinTailwindClasses("", className);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={buttonClasses}>
        BUTTON
      </button>
      <Drawer
        open={isOpen}
        onOpenChange={setIsOpen}
        title={
          <div className="flex gap-6">
            <Image src="/images/help-document.svg" width={44} height={56} alt="Help document" className="shrink-0" />
            <div>
              <span className="block text-sm text-text-primary font-normal leading-5">Product support</span>
              <span className="block pt-1 text-3xl text-text-brand font-heavy leading-9 tracking-tight">‘{title}’</span>
            </div>
          </div>
        }
      >
        <div className="mt-2 border-t border-border-normal">TODO</div>
      </Drawer>
    </>
  );
};
