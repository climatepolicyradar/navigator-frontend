import { ReactNode, useEffect } from "react";
import { LuX } from "react-icons/lu";

import { Card } from "@/components/atoms/card/Card";
import { Heading } from "@/components/typography/Heading";

export interface ModalProps {
  cardClasses?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  title?: ReactNode;
}

export const Modal = ({ cardClasses = "", children, isOpen, onClose, showCloseButton = true, title }: ModalProps) => {
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

  return (
    <div
      className={`fixed inset-0 z-2000 flex flex-col justify-center items-center bg-surface-mono-dark/50 overflow-hidden transition duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onModalClick}
    >
      <Card
        variant="outlined"
        className={`relative max-w-[460px] max-h-[calc(100vh-32px)] sm:max-h-[calc(100vh-64px)] px-8 py-6 m-4 !border-0 !rounded-2xl overflow-hidden ${cardClasses}`}
      >
        <div className="mb-3 flex flex-row-reverse justify-between items-center gap-3">
          {showCloseButton && (
            <button onClick={onClose} className="text-text-brand">
              <LuX size="18" />
            </button>
          )}
          <Heading level={1} className="text-lg leading-tight font-semibold text-text-primary flex-1">
            {title}
          </Heading>
        </div>
        <div className="flex flex-col gap-4 text-sm text-text-secondary">{children}</div>
      </Card>
    </div>
  );
};
