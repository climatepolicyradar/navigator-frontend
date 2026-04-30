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
        <Drawer.Backdrop className="fixed inset-0 bg-inky-black/40 transition duration-120" />
        <Drawer.Viewport className="fixed right-0 top-0 h-full w-4/5 max-w-200 transition-transform duration-120 data-starting-style:translate-x-full data-ending-style:translate-x-full">
          <Drawer.Popup className={`h-full bg-white shadow-xl flex flex-col gap-6 overflow-y-auto p-6 ${styles["highlights"]}`}>
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
                    <Drawer.Viewport className="fixed right-0 top-0 h-full w-3/5 max-w-180 transition-transform duration-120 data-starting-style:translate-x-full data-ending-style:translate-x-full">
                      <Drawer.Popup className="h-full bg-white shadow-2xl flex flex-col overflow-y-auto p-6">
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
