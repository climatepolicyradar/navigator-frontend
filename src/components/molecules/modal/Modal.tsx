import { Card } from "@/components/atoms/card/Card";
import React, { useEffect } from "react";
import { LuX } from "react-icons/lu";

interface ModalProps {
  cardClasses?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
}

export const Modal = ({ cardClasses = "", children, isOpen, onClose, showCloseButton = true }: ModalProps) => {
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
    event.preventDefault();
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-center items-center bg-surface-mono-dark/50 overflow-hidden ${
        isOpen ? "visible" : "invisible"
      }`}
      onClick={onModalClick}
    >
      <Card variant="outlined" className={`relative max-w-maxContent m-4 sm:m-8 !border-0 !rounded-xl ${cardClasses}`}>
        {showCloseButton && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2">
            <LuX height="16" width="16" />
          </button>
        )}
        {children}
      </Card>
    </div>
  );
};
