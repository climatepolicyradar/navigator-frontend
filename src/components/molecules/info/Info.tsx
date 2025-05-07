import { Popover } from "@/components/atoms/popover/Popover";
import { joinTailwindClasses } from "@/utils/tailwind";
import { ReactNode, useState } from "react";
import { LuInfo } from "react-icons/lu";

type InfoProps = {
  className?: string;
  children: ReactNode;
};

export const Info = ({ className, children }: InfoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const infoClasses = joinTailwindClasses(isOpen ? "text-text-brand" : "text-text-secondary", className);

  return (
    <Popover
      openOnHover
      onOpenChange={setIsOpen}
      trigger={
        <div className={infoClasses}>
          <LuInfo height="16" width="16" />
        </div>
      }
    >
      {children}
    </Popover>
  );
};
