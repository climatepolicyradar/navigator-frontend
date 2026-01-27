import { Info as LuInfo } from "lucide-react";
import { ReactNode, useState } from "react";

import { Popover, TPopoverLink } from "@/components/atoms/popover/Popover";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  className?: string;
  title?: string;
  description: ReactNode;
  link?: TPopoverLink;
}

export const Info = ({ className, description, link, title }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const infoClasses = joinTailwindClasses("!cursor-help", isOpen ? "text-text-brand" : "text-text-secondary", className);

  return (
    <Popover
      openOnHover
      onOpenChange={setIsOpen}
      trigger={
        <button className={infoClasses} role="button">
          <LuInfo size={16} />
        </button>
      }
      title={title}
      description={description}
      link={link}
    />
  );
};
