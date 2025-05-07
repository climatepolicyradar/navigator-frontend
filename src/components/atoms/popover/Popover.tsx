import { ExternalLink } from "@/components/ExternalLink";
import { joinTailwindClasses } from "@/utils/tailwind";
import { Popover as BasePopover } from "@base-ui-components/react/popover";
import { ReactElement, ReactNode } from "react";

const PopoverArrow = () => (
  <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
    <path
      d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
      className="fill-surface-light"
    />
    <path
      d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
      className="fill-border-light"
    />
  </svg>
);

// Provide options for structuring the popover using props & Base UI components (heavily preferred) or children for full flexibility

interface PopoverGenericProps {
  onOpenChange?: (open: boolean) => void;
  openOnHover?: boolean;
  popupClasses?: string;
  trigger: ReactElement;
}

interface PopoverElementProps extends PopoverGenericProps {
  title?: string;
  description: string;
  link?: {
    href: string;
    text: string;
  };
  children?: never;
}

interface PopoverChildrenProps extends PopoverGenericProps {
  children: ReactNode;
  title?: never;
  description?: never;
  link?: never;
}

type PopoverProps = PopoverElementProps | PopoverChildrenProps;

export const Popover = ({ children, description, link, onOpenChange, openOnHover = false, popupClasses = "", title, trigger }: PopoverProps) => {
  const allPopupClasses = joinTailwindClasses(
    "p-3 max-w-[350px] bg-surface-light border border-border-light rounded-md shadow-md text-sm leading-normal select-none focus-visible:outline-0",
    popupClasses
  );

  return (
    <BasePopover.Root openOnHover={openOnHover} onOpenChangeComplete={onOpenChange}>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner positionMethod="fixed" sideOffset={8}>
          <BasePopover.Popup className={allPopupClasses}>
            <BasePopover.Arrow className="flex -top-2">
              <PopoverArrow />
            </BasePopover.Arrow>
            {children || (
              <>
                {title && <BasePopover.Title className="mb-2 font-bold capitalize">{title}</BasePopover.Title>}
                <BasePopover.Description>
                  <span className="block">{description}</span>
                  {link && (
                    <ExternalLink url={link.href} className="block mt-2 underline">
                      {link.text}
                    </ExternalLink>
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
