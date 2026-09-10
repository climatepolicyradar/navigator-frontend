import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown, LucideInfo } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { FAQS_DICTIONARY } from "@/constants/faqs";
import { PRODUCT_SUPPORT } from "@/constants/productSupport";
import { isFAQKey, TProductSupportKey } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

const COLLAPSE_THRESHOLD = 4;

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
  const defaultOpenItems = items.length < COLLAPSE_THRESHOLD ? items.map((_, index) => index) : [0];

  const buttonClasses = joinTailwindClasses("inline cursor-help!", className);
  const buttonChildren = tooltip ? <LucideInfo size={16} className="text-text-brand" /> : children;

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={buttonClasses}>
        {buttonChildren}
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
        <Accordion.Root multiple defaultValue={defaultOpenItems} className="mt-2 flex flex-col border-t border-border-normal">
          {items.map((item, index) => {
            const faq = isFAQKey(item) ? FAQS_DICTIONARY[item] : item;
            return (
              <Accordion.Item key={index} value={index} className="group border-b border-border-normal">
                <Accordion.Header>
                  <Accordion.Trigger className="flex items-center justify-between w-full gap-4 py-6 text-left">
                    <span className="text-base text-text-primary font-medium leading-5">{faq.title}</span>
                    <ChevronDown size={16} className="text-elem-icon shrink-0 group-data-open:rotate-180 transition duration-300" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className="pb-6 text-base text-text-primary font-normal leading-6">{faq.content}</Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </Drawer>
    </>
  );
};
