import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

import { Card } from "@/components/atoms/card/Card";
import { Heading } from "@/components/typography/Heading";
import { joinTailwindClasses } from "@/utils/tailwind";

interface ModalProps {
  cardClasses?: string;
  children: ReactNode;
  contentClasses?: string;
  headerImage?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  title?: ReactNode;
}

export const Modal = ({
  cardClasses = "",
  children,
  contentClasses = "",
  headerImage,
  isOpen,
  onClose,
  showCloseButton = true,
  title,
}: ModalProps) => {
  // Disable scroll on the page body when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Only close when the parent container is clicked
  const onModalClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const allCardClasses = joinTailwindClasses(
    "relative max-w-[460px] max-h-[calc(100vh-32px)] sm:max-h-[calc(100vh-64px)] m-4 !border-0 !rounded-2xl overflow-hidden",
    headerImage ? "!px-0 !py-0" : "px-8 py-6",
    cardClasses
  );

  const allContentClasses = joinTailwindClasses(headerImage ? "px-8 py-6" : "", contentClasses);

  return (
    <div
      className={`fixed inset-0 z-2000 flex flex-col justify-center items-center bg-surface-mono-dark/50 overflow-hidden transition duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onModalClick}
    >
      <Card variant="outlined" className={allCardClasses}>
        {headerImage}
        <div className={allContentClasses}>
          <div className="mb-3 flex flex-row-reverse justify-between items-center gap-3">
            {showCloseButton && (
              <button role="button" title="Dismiss modal" onClick={onClose} className="text-icon-standard">
                <X size="18" />
              </button>
            )}
            <Heading level={2} className="text-lg leading-tight font-semibold text-text-primary flex-1">
              {title}
            </Heading>
          </div>
          <div className="flex flex-col gap-4 text-sm text-text-secondary">{children}</div>
        </div>
      </Card>
    </div>
  );
};
