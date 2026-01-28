import { Popover as BasePopover } from "@base-ui/react/popover";
import { JSX, ReactNode } from "react";

import { BaseUIArrow } from "@/utils/baseUI";
import { joinTailwindClasses } from "@/utils/tailwind";

import { PageLink } from "../pageLink/PageLink";

export type TPopoverLink = {
  href: string;
  text: string;
  external?: boolean;
  hash?: string;
};

// Provide options for structuring the popover using props & Base UI components (heavily preferred) or children for full flexibility

interface IPopoverGenericProps {
  onOpenChange?: (open: boolean) => void;
  openOnHover?: boolean;
  popupClasses?: string;
  trigger: JSX.Element;
}

interface IPopoverElementProps extends IPopoverGenericProps {
  title?: string;
  description: ReactNode;
  link?: TPopoverLink;
  children?: never;
}

interface IPopoverChildrenProps extends IPopoverGenericProps {
  children: ReactNode;
  title?: never;
  description?: never;
  link?: never;
}

type TProps = IPopoverElementProps | IPopoverChildrenProps;

export const Popover = ({ children, description, link, onOpenChange, openOnHover = false, popupClasses = "", title, trigger }: TProps) => {
  const allPopupClasses = joinTailwindClasses(
    "p-3 max-w-[350px] bg-white border border-gray-300 rounded-md shadow-md text-sm text-gray-700 leading-normal select-auto focus-visible:outline-0 z-[50]",
    popupClasses
  );

  return (
    <BasePopover.Root openOnHover={openOnHover} onOpenChangeComplete={onOpenChange}>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner positionMethod="fixed" sideOffset={8} className="z-50">
          <BasePopover.Popup className={allPopupClasses}>
            <BasePopover.Arrow className="flex -top-2">
              <BaseUIArrow fill="fill-white" stroke="fill-gray-300" />
            </BasePopover.Arrow>
            {children || (
              <>
                {title && <BasePopover.Title className="mb-2 text-gray-950 font-bold">{title}</BasePopover.Title>}
                <BasePopover.Description>
                  <span className="block">{description}</span>
                  {link && (
                    <PageLink
                      external={link.external}
                      href={link.href}
                      hash={link.hash}
                      className="block mt-2 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
                    >
                      {link.text}
                    </PageLink>
                  )}
                </BasePopover.Description>
              </>
            )}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};
