import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";

export type TFilterableDocument = {
  importId: string;
  title: string;
};

type TProps = {
  documents: TFilterableDocument[];
  label: string;
  onSelectionChange: (selectedImportIds: string[]) => void;
  selectedImportIds: string[];
};

export const DocumentsFilter = ({ documents, label, onSelectionChange, selectedImportIds }: TProps) => {
  const selected = new Set(selectedImportIds);
  // Searching zero documents has no useful result, so the last remaining selection is held.
  const isLastSelected = (importId: string) => selected.size === 1 && selected.has(importId);

  const handleCheckedChange = (importId: string, checked: boolean) => {
    onSelectionChange(checked ? [...selectedImportIds, importId] : selectedImportIds.filter((id) => id !== importId));
  };

  return (
    <BasePopover.Root>
      <BasePopover.Trigger className="flex gap-2 items-center px-3 py-2 bg-bg-primary data-popup-open:bg-bg-flat text-sm text-text-primary font-medium leading-5 border border-border-normal rounded-full">
        <span>
          {label} ({selected.size})
        </span>
        <ChevronDown size={16} className="text-elem-icon" />
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner positionMethod="fixed" side="bottom" sideOffset={8} align="start">
          <BasePopover.Popup className="w-83 max-h-[calc(100dvh-12px)] px-6 py-5 bg-bg-primary border border-border-normal rounded-xl shadow-2xl overflow-y-auto">
            <ul className="flex flex-col gap-4" aria-label={label}>
              {documents.map((document) => (
                <li key={document.importId}>
                  <Checkbox
                    checked={selected.has(document.importId)}
                    disabled={isLastSelected(document.importId)}
                    onCheckedChange={(value) => handleCheckedChange(document.importId, value === true)}
                  >
                    {document.title}
                  </Checkbox>
                </li>
              ))}
            </ul>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};
