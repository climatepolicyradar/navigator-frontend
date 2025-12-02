import { ReactNode } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { TFamilyDocumentPublic } from "@/types";

interface IProps {
  document?: TFamilyDocumentPublic;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const DocumentDrawer = ({ document, onOpenChange, open }: IProps) => {
  if (!document) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} title="Document">
        {null}
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={document.title}>
      <p>test</p>
    </Drawer>
  );
};
