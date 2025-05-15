import { Popover, TPopoverLink } from "@/components/atoms/popover/Popover";
import { joinTailwindClasses } from "@/utils/tailwind";
import { useState } from "react";
import { LuInfo } from "react-icons/lu";

interface IProps {
  className?: string;
  title?: string;
  description: string;
  link?: TPopoverLink;
}

export const Info = ({ className, description, link, title }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const infoClasses = joinTailwindClasses("cursor-help", isOpen ? "text-text-brand" : "text-text-secondary", className);

  return (
    <Popover
      openOnHover
      onOpenChange={setIsOpen}
      trigger={
        <div className={infoClasses}>
          <LuInfo size={16} />
        </div>
      }
      title={title}
      description={description}
      link={link}
    />
  );
};
