import { Drawer } from "@base-ui/react/drawer";
import { LucideFileText, LucideX } from "lucide-react";
import { useState } from "react";

import { SearchDocument } from "@/api/search";

import styles from "../searchResults/SearchResults.module.css";

function linkHref(doc: SearchDocument): string | undefined {
  if (doc.attributes.deprecated_slug)
    if (doc.labels.find((label) => label.value.value === "Principal")) {
      return `/document/${doc.attributes.deprecated_slug}`;
    } else {
      return `/documents/${doc.attributes.deprecated_slug}`;
    }
}

type TDocumentDrawerProps = {
  document: SearchDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DocumentDrawer({ document, open, onOpenChange }: TDocumentDrawerProps) {
  const [nestedDocument, setNestedDocument] = useState<SearchDocument | null>(null);
  const [nestedDrawerOpen, setNestedDrawerOpen] = useState(false);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setNestedDrawerOpen(false);
        onOpenChange(isOpen);
      }}
      swipeDirection="right"
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 bg-inky-black duration-200 [--backdrop-opacity:0.2] [--bleed:3rem] min-h-dvh opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0 " />
        <Drawer.Viewport className="fixed inset-0 flex items-stretch justify-end">
          <Drawer.Popup
            className={`h-full bg-white rounded-l-xl shadow-xl flex flex-col gap-6 overflow-y-auto p-6 w-4/5 max-w-200 border-l border-transparent-regular transition-transform duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] data-starting-style:translate-x-full data-ending-style:translate-x-full ${styles["highlights"]}`}
          >
            {document && (
              <>
                <div className="flex items-start justify-between">
                  <Drawer.Title className="text-xl font-semibold flex-1 mr-4">
                    {linkHref(document) ? (
                      <a href={linkHref(document)!} className="text-inky-blue hover:underline" dangerouslySetInnerHTML={{ __html: document.title }} />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: document.title }} />
                    )}
                  </Drawer.Title>
                  <Drawer.Close className="text-neutral-500 hover:text-neutral-800 shrink-0">
                    <LucideX width={20} height={20} />
                  </Drawer.Close>
                </div>
                {document.description && <p className="text-sm" dangerouslySetInnerHTML={{ __html: document.description }} />}
                {document.documents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      Documents in this {document.labels.filter((label) => label.type === "category")[0].value.value} ({document.documents.length})
                    </h4>
                    <ul className="space-y-1">
                      {document.documents.map((rel, i) => (
                        <li key={i}>
                          <button
                            className="text-left w-full text-sm flex items-start gap-2 py-1 hover:text-inky-blue hover:underline"
                            onClick={() => {
                              setNestedDocument(rel.value);
                              setNestedDrawerOpen(true);
                            }}
                          >
                            <LucideFileText width={14} height={14} className="shrink-0 mt-0.5" />
                            <span dangerouslySetInnerHTML={{ __html: rel.value.title }} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {document.labels.map((label, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-neutral-100 rounded px-2 py-1">
                      <span className="font-medium">{label.type}:</span> {label.value.value}
                    </span>
                  ))}
                </div>

                {/* Nested drawer lives inside the parent Popup so Base UI can track nesting */}
                <Drawer.Root open={nestedDrawerOpen} onOpenChange={setNestedDrawerOpen} swipeDirection="right">
                  <Drawer.Portal>
                    <Drawer.Viewport className="fixed inset-0 flex items-stretch justify-end">
                      <Drawer.Popup className="h-full bg-white rounded-l-xl shadow-2xl flex flex-col overflow-y-auto p-6 w-3/5 max-w-180 border-l border-transparent-regular transition-transform duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] data-starting-style:translate-x-full data-ending-style:translate-x-full">
                        {nestedDocument && (
                          <>
                            <div className="flex items-start justify-between mb-4">
                              <Drawer.Title className="text-lg font-semibold flex-1 mr-4">
                                {linkHref(nestedDocument) ? (
                                  <a
                                    href={linkHref(nestedDocument)!}
                                    className="text-inky-blue hover:underline"
                                    dangerouslySetInnerHTML={{ __html: nestedDocument.title }}
                                  />
                                ) : (
                                  <span dangerouslySetInnerHTML={{ __html: nestedDocument.title }} />
                                )}
                              </Drawer.Title>
                              <Drawer.Close className="text-neutral-500 hover:text-neutral-800 shrink-0">
                                <LucideX width={20} height={20} />
                              </Drawer.Close>
                            </div>
                            {nestedDocument.description && (
                              <p className="text-sm text-neutral-700 mb-4" dangerouslySetInnerHTML={{ __html: nestedDocument.description }} />
                            )}
                            <div className="flex flex-wrap gap-1">
                              {nestedDocument.labels.map((label, i) => (
                                <span key={i} className="inline-flex items-center gap-1 text-xs bg-neutral-100 rounded px-2 py-1">
                                  <span className="font-medium">{label.type}:</span> {label.value.value}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </Drawer.Popup>
                    </Drawer.Viewport>
                  </Drawer.Portal>
                </Drawer.Root>
              </>
            )}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
